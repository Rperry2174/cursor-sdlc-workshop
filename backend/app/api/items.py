from fastapi import APIRouter

router = APIRouter()


@router.get("")
def list_items():
    return {"items": []}


@router.get("/{item_id}")
def get_item(item_id: int):
    return {"id": item_id, "name": "Example"}
