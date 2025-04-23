from schemas import UserResponse,TicketResponse,TicketUser,UserCreate,TicketCreate,UserLogin,TicketUpdate,TicketTextTitleUpdate,TicketDelete,GroupResponse
from models import  User, Ticket, UserTicket, Group, groupTicket,user_group
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
async def get_users(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_id = current_user.id
    result = await db.execute(select(Group).join(user_group, user_group.group_id == Group.id).where(user_group.user_id==user_id))
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

@router.delete("/deleteGroupTicket")
async def delete_group_ticket(tickedDelete : TicketDelete,  db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(groupTicket).where(groupTicket.id == tickedDelete.id))
    db_ticket = result.scalars().first()
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    await db.delete(db_ticket)
    await db.commit()

    return {
    "TicketTable": f"Ticket with id: {tickedDelete.id} deleted from group_tickets",
    }





