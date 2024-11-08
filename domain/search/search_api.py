from fastapi import APIRouter
from domain.search import autocomplete
from domain.search import search_title


router = APIRouter()

router.include_router(autocomplete.router, tags=["search"])
router.include_router(search_title.router, tags=["search"])
