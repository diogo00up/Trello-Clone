from .schemas import UserResponse,UserCreate,UserLogin
from models import  User
from database import get_db
from auth import  create_access_token
from passlib.context import CryptContext
from fastapi import  APIRouter, HTTPException, Depends
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import APIRouter
import logging

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Object created for hashing and verifistion of passwords

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


@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)
    new_user = User(email=user.email, username=user.username, password_hash=hashed_password)
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

