from schemas import UserResponse,TicketResponse,TicketUser,UserCreate,TicketCreate,UserLogin,TicketUpdate,TicketTextTitleUpdate,TicketDelete,GroupResponse
from models import  User, Ticket, UserTicket, Group
from database import get_db
from auth import get_current_user, create_access_token
from typing import List
from passlib.context import CryptContext
from fastapi import  APIRouter, HTTPException, Depends
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import APIRouter
import logging


router = APIRouter()
@router.get("/groups", response_model=List[GroupResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Group))
    groups = result.scalars().all()  
    return groups

