from models import  User
from auth import get_current_user
from fastapi import  APIRouter ,Depends
from fastapi import APIRouter

router = APIRouter()

@router.get("/retrieveUserInfo")
async def retrieve_user_info(current_user: User = Depends(get_current_user)):
    return {
            "id": current_user.id,
            "username":current_user.username,
            "email": current_user.email,
    }