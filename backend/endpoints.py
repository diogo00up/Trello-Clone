from schemas import UserResponse,TicketResponse,TicketUser,UserCreate,TicketCreate,UserLogin,TicketUpdate,TicketTextTitleUpdate,TicketDelete
from models import  User, Ticket, UserTicket
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

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Object created for hashing and verifistion of passwords

@router.get("/users", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()  # Retrieves all users
    return users

@router.get("/tickets", response_model=List[TicketResponse])
async def get_tickets(db: AsyncSession = Depends(get_db)): 
    result = await db.execute(select(Ticket))
    tickets = result.scalars().all()  # Retrives all tickets
    return tickets


@router.put("/updatedtickets")
async def update_ticket_class(update_data: TicketUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Fetch the ticket to check if it exists
    result = await db.execute(select(Ticket).where(Ticket.id == update_data.ticket_id))
    ticket = result.scalar_one_or_none()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.ticket_class = update_data.ticket_class
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)

    return {"message": "Ticket updated successfully", "ticket": ticket}


@router.put("/updateTextTitle")
async def update_ticket_class(newdata: TicketTextTitleUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Ticket).where(Ticket.id == newdata.id))
    ticket = result.scalar_one_or_none()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.title = newdata.title
    ticket.description =newdata.text
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return {"message": "Ticket Ttile and data updated successfully", "ticket": ticket}


@router.delete("/deleteTicket")
async def delete_ticket(tickedDelete : TicketDelete,  db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):

    result = await db.execute(select(Ticket).where(Ticket.id == tickedDelete.id))
    db_ticket = result.scalars().first()
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    await db.delete(db_ticket)
    await db.commit()
    
    result = await db.execute(select(UserTicket).where(UserTicket.ticket_id == tickedDelete.id))
    db_userTickets = result.scalars().all()
    if db_userTickets is None:
        raise HTTPException(status_code=404, detail="Conections not found")
    for x in db_userTickets:
        await db.delete(x)
    await db.commit()
   
    return {
        "TicketTable": f"Ticket with id: {tickedDelete.id} deleted",
        "TicketUser": "Deleted all connections with the deleted ticket"
    }


@router.get("/user_ticket", response_model=List[TicketUser])
async def get_tickets(db: AsyncSession = Depends(get_db)): 
    result = await db.execute(select(UserTicket))
    rows = result.scalars().all()  # Retrives all tickets
    return rows

@router.get("/joinedTables")
async def get_joined_tables(db: AsyncSession = Depends(get_db)): 
    stmt = (
        select(User, Ticket)
        .join(UserTicket, UserTicket.user_id == User.id)
        .join(Ticket, Ticket.id == UserTicket.ticket_id).where(User.id==1)
    )

    result = await db.execute(stmt)
    rows = result.all()  # returns list of tuples (User, Ticket)
    return [
        {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "ticket": {
                "id": ticket.id,
                "title": ticket.title,
                "description": ticket.description,
                "ticket_class" : ticket.ticket_class
            }
        }
        for user, ticket in rows
    ]

@router.post("/tickets", response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate, db: AsyncSession = Depends(get_db)):
    new_ticket = Ticket(title=ticket.title, description=ticket.description)
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)
    return new_ticket



@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, username=user.username, password_hash=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    
    result = await db.execute(select(User).where(User.username == user.logInUsername))
    db_user = result.scalars().first()

    if db_user is None or not pwd_context.verify(user.logInPassword, db_user.password_hash):
        logging.error(f"Either username or password doesnt match with that its in the database: {user.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    
    access_token = create_access_token(data={"sub": db_user.username})
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/createTicket")
async def dashboard(ticket: TicketCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_ticket = Ticket(title=ticket.title, description=ticket.description,ticket_owner = current_user.id, ticket_class="backlog")
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)
    owner_id = new_ticket.ticket_owner
    ticket_id =  new_ticket.id
    return {    
        "owner_id": owner_id,
        "ticket_id": ticket_id
    }
    
@router.post("/createTicketUserRelation")
async def dashboard(relation: TicketUser, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_relation = UserTicket(user_id = relation.user_id,ticket_id = relation.ticket_id)
    db.add(new_relation)
    await db.commit()
    await db.refresh(new_relation)
    return {"relation i wanna create is  ": relation, "Put in data base :" : new_relation}
   


@router.get("/loadTickets")
async def dashboard(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_id = current_user.id
    stmt = (select(Ticket).join(UserTicket, UserTicket.ticket_id == Ticket.id).join(User, User.id == UserTicket.user_id).where(User.id == user_id))
    result = await db.execute(stmt)
    db_tickets = result.scalars().all() 
    
    if not db_tickets:
         raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Error retrieving tickets from database",
    )
    return {"message": f"Sending to user with id: {current_user.id}!", "tickets": db_tickets}



