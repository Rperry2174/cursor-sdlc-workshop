from functools import lru_cache
from typing import Literal, NamedTuple

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import torch

from app.config import settings

router = APIRouter()


class TranslateRequest(BaseModel):
    text: str
    direction: str  # "la_en" | "en_la"


class TranslateResponse(BaseModel):
    translated_text: str


Direction = Literal["la_en", "en_la"]


class ModelSpec(NamedTuple):
    model_name: str
    input_prefix: str = ""


MODEL_SPECS: dict[Direction, ModelSpec] = {
    "la_en": ModelSpec(model_name=settings.latin_to_english_model),
    "en_la": ModelSpec(
        model_name=settings.english_to_latin_model,
        input_prefix=settings.english_to_latin_prefix,
    ),
}


class LoadedTranslator(NamedTuple):
    tokenizer: object
    model: object
    device: torch.device


@lru_cache(maxsize=2)
def load_translator(model_name: str) -> LoadedTranslator:
    try:
        from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    except ImportError as exc:  # pragma: no cover - depends on environment
        raise HTTPException(
            status_code=503,
            detail=(
                "Translation dependencies are not installed. "
                "Run `pip install -r backend/requirements.txt`."
            ),
        ) from exc

    cache_dir = settings.translation_model_cache_dir
    tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir=cache_dir)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name, cache_dir=cache_dir)

    device = torch.device("cpu")
    model.to(device)
    model.eval()
    return LoadedTranslator(tokenizer=tokenizer, model=model, device=device)


def translate_with_model(text: str, spec: ModelSpec) -> str:
    translator = load_translator(spec.model_name)
    input_text = f"{spec.input_prefix}{text}" if spec.input_prefix else text

    try:
        inputs = translator.tokenizer(
            input_text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
        )
        inputs = {key: value.to(translator.device) for key, value in inputs.items()}
        with torch.no_grad():
            generated = translator.model.generate(
                **inputs,
                num_beams=4,
                max_new_tokens=128,
            )
        translated = translator.tokenizer.batch_decode(
            generated,
            skip_special_tokens=True,
        )[0].strip()
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Translation failed while running {spec.model_name}: {exc}",
        ) from exc

    if not translated:
        raise HTTPException(
            status_code=502,
            detail="The translation model returned an empty result.",
        )
    return translated


@router.post("", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    if req.direction not in ("la_en", "en_la"):
        raise HTTPException(status_code=400, detail="direction must be 'la_en' or 'en_la'")

    text = (req.text or "").strip()
    if not text:
        return TranslateResponse(translated_text="")

    spec = MODEL_SPECS[req.direction]
    translated = translate_with_model(text, spec)
    return TranslateResponse(translated_text=translated)
