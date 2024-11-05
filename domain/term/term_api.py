# domain/term/term_api.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_terms():
    return {"message": "Get all terms"}

@router.post("/")
async def create_term():
    return {"message": "Create a term"}

@router.put("/{term_id}")
async def update_telsrm(term_id: int):
    return {"message": f"Updated term with ID {term_id}"}

@router.delete("/{term_id}")
async def delete_term(term_id: int):
    return {"message": f"Deleted term with ID {term_id}"}
