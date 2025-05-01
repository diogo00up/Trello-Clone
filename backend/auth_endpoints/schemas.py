from pydantic import BaseModel

# Modelo Pydantic para serialização dos dados

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
    logInUsername: str  
    logInPassword: str  

    