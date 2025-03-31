from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.future import select
from typing import List
from pydantic import BaseModel
from typing import List

# Modelo Pydantic para serialização dos dados
class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True  # Para compatibilidade com SQLAlchemy

# Database setup
DATABASE_URL = "mysql+aiomysql://root:Adivinha12345!@localhost:3306/trellodb"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()

# Define SQLAlchemy model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255))
    password_hash = Column(String(255))
    email = Column(String(255))

# FastAPI app setup
app = FastAPI()

# Dependency to get the DB session
async def get_db():
    async with SessionLocal() as session:
        yield session

@app.get("/users", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()  # Recupera todos os usuários
    return users
