from fastapi import FastAPI, HTTPException, Depends
from fastapi import status
from fastapi import Security
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.future import select
from typing import List
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv
import os
import logging
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt  # Make sure python-jose is installed
from fastapi import Request

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # This is the login endpoint

logging.basicConfig(
    level=logging.INFO,  # You can use DEBUG, INFO, WARNING, ERROR, CRITICAL depending on your needs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('app_errors.log'), logging.StreamHandler()]
)

# Modelo Pydantic para serialização dos dados

##User

class UserResponse(BaseModel):
    id: int
    username: str
    email: str


    class Config:
        from_attributes = True  

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

    class Config:
        from_attributes = True  

class UserLogin(BaseModel):
    logInUsername: str  # Now matches frontend
    logInPassword: str  # Now matches frontend

##Ticket

class TicketResponse(BaseModel):
    id: int
    title: str
    description: str

    class Config:
        from_attributes = True  


class TicketCreate(BaseModel):
    title: str
    description: str

    class Config:
        from_attributes = True  





# Database setup
load_dotenv()  # Load environment variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL")  # get my database URL from the env file

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables")


engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

# Define SQLAlchemy 
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255))
    password_hash = Column(String(255))
    email = Column(String(255))


class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(String(255))

# FastAPI app setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_db():
    async with SessionLocal() as session:
        yield session

##Get Endpoints

@app.get("/")
async def root():
    return {"message": "Welcome to Trello Clone API! Switch endpoints(users, tickets) to get the information you need!"}


@app.get("/users", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()  # Retrieves all users
    return users

@app.get("/tickets", response_model=List[TicketResponse])
async def get_tickets(db: AsyncSession = Depends(get_db)): 
    result = await db.execute(select(Ticket))
    tickets = result.scalars().all()  # Retrives all tickets
    return tickets

##Post Endpoints

@app.post("/tickets", response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate, db: AsyncSession = Depends(get_db)):
    new_ticket = Ticket(title=ticket.title, description=ticket.description)
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)
    return new_ticket

## LogIn and Create User EndPoint

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Object created for hashing and verifistion of passwords

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, username=user.username, password_hash=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


SECRET_KEY = os.getenv("SECRET_KEY")  # get my database URL from the env file
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in the environment variables")

ALGORITHM = "HS256"  # The algorithm used to sign the JWT


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None): # Create  JWT token
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=25)  # default expiration time is 15 minutes
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/login")
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

# Verify Token 

async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Fetch user from database
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/createTicket")
async def dashboard(ticket: TicketCreate, current_user: User = Depends(get_current_user)):
    return {"message": f"Welcome {current_user.username}!", "ticket": ticket}


