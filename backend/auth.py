import os
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt  
from database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from models import  User
from fastapi import HTTPException, Depends
from fastapi import status
from sqlalchemy.future import select
import jwt
from fastapi.security import OAuth2PasswordBearer


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login") 

SECRET_KEY = os.getenv("SECRET_KEY")  
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in the environment variables")

ALGORITHM = "HS256"  


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None): # Create  JWT token
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60) 
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)): #token verificatiob function that retrives which user belongs the token to
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


