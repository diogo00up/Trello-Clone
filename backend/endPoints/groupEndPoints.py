from schemas import UserResponse,TicketResponse,TicketUser,UserCreate,TicketCreate,UserLogin,TicketUpdate,TicketTextTitleUpdate,TicketDelete,GroupResponse
from models import  User, Ticket, UserTicket, Group, groupTicket
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

@router.get("/GroupTickets")
async def get_GroupTickets(group_id: int ,db: AsyncSession = Depends(get_db)):
    stmt = (select(groupTicket).where(groupTicket.group_id==group_id))
    result = await db.execute(stmt)
    db_tickets = result.scalars().all() 
    
    if not db_tickets:
         raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Error retrieving tickets from database",
    )

    return db_tickets
