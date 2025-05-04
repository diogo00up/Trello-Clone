from .schemas import GroupTicketCreate,TicketTextTitleUpdate,TicketDelete,GroupResponse,GroupTicketResponse,TicketUpdate,RoleResponse,DateUpdate,UserGroupCreate,UserGroupUpdate
from models import  User, Group, groupTicket,user_group
from database import get_db
from auth import get_current_user
from typing import List
from fastapi import  APIRouter, HTTPException, Depends
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import select, not_
from fastapi import APIRouter
from datetime import date


router = APIRouter()
@router.get("/groups", response_model=List[GroupResponse])
async def get_users(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_id = current_user.id
    result = await db.execute(select(Group).join(user_group, user_group.group_id == Group.id).where(user_group.user_id==user_id))
    groups = result.scalars().all()  
    return groups

@router.get("/GroupTickets", response_model=List[GroupTicketResponse])
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

@router.put("/updateGroupTextTitle")
async def update_group_ticket_class(newdata: TicketTextTitleUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(groupTicket).where(groupTicket.id == newdata.id))
    ticket = result.scalar_one_or_none()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.title = newdata.title
    ticket.description =newdata.text
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return {"message": "Group Ticket Title and data updated successfully", "ticket": ticket}


@router.post("/createGroupTicket")
async def create_group_ticket(ticket: GroupTicketCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_ticket = groupTicket(title=ticket.title, description=ticket.description,ticket_owner = current_user.id, ticket_class="backlog",group_id=ticket.group_id, date_deliver=date.today())
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)
    return new_ticket

@router.put("/updatedGroupTickets")
async def update_group_ticket_class(update_data: TicketUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):

    result = await db.execute(select(groupTicket).where(groupTicket.id == update_data.ticket_id))
    ticket = result.scalar_one_or_none()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.ticket_class = update_data.ticket_class
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)

    return {"message": "Ticket updated successfully", "ticket": ticket}

@router.get("/getUserRole", response_model=List[RoleResponse])
async def get_GroupTickets(group_id: int , db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = (select(user_group).where(user_group.group_id==group_id).where(user_group.user_id==current_user.id))
    result = await db.execute(stmt)
    line = result.scalars().all() 
    
    if not line:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error retrieving tickets from database",
        )

    return line


@router.get("/getAllUsers")
async def get_all_users(group_id: int , db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):

    stmt = select(User,user_group).join(user_group, User.id==user_group.user_id).where(user_group.group_id==group_id)
    result = await db.execute(stmt)
    lines = result.all() 
    
    if not lines:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No users found"
        )

    return [
          {
            "id": user.id,
            "username": user.username,
            "group_id": user_group.group_id if user_group else None,  
            "is_admin": user_group.is_admin if user_group else None,  
        }

        for user, user_group in lines
    ]


@router.post("/retriveUsersNotInGroup")
async def get_users_not_in_group(member_ids: List[int], db: AsyncSession = Depends(get_db)):

    stmt = select(User).where(not_(User.id.in_(member_ids)))
    result = await db.execute(stmt)
    users = result.scalars().all()
    
  
        
    return [
        {
            "id": user.id,
            "username": user.username
        }
        for user in users
    ]


@router.put("/updateTicketDate")
async def update_ticket_date(newdata: DateUpdate , db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(groupTicket).where(groupTicket.id == newdata.id))
    ticket = result.scalar_one_or_none()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.date_deliver = newdata.date
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return {"message": "Group Ticket date was updated", "ticket": ticket}
 

@router.post("/createUserGroup")
async def create_user_group(usergroup:  UserGroupCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_user_group = user_group(user_id=usergroup.user_id, group_id=usergroup.group_id,is_admin = 0)
    db.add(new_user_group)
    await db.commit()
    await db.refresh(new_user_group)
    return new_user_group



@router.put("/updatedUserGroup")
async def update_user_group(update_data: UserGroupUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):

    result = await db.execute(select(user_group).where(user_group.user_id==update_data.user_id).where(user_group.group_id==update_data.group_id))
    row = result.scalar_one_or_none()
    
    if not row:
        raise HTTPException(status_code=404, detail="Row not found")
    
    row.is_admin = update_data.is_admin
    db.add(row)
    await db.commit()
    await db.refresh(row)

    return {"message": "UserGroup relation updated", "row: ": row}