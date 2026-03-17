from fastapi import APIRouter

from app.api import items, translate

router = APIRouter()
router.include_router(items.router, prefix="/items", tags=["items"])
router.include_router(translate.router, prefix="/translate", tags=["translate"])
