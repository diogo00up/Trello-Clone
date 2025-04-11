from pydantic import BaseModel

# Modelo Pydantic para serialização dos dados

class UserResponse(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True  
        

class TicketUser(BaseModel):
    id: int
    user_id: int
    ticket_id: int

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

    
class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    ticket_class: str

    class Config:
        from_attributes = True  

class TicketCreate(BaseModel):
    title: str
    description: str
    
    class Config:
        from_attributes = True  

class TicketUpdate(BaseModel):
    ticket_id: int
    ticket_class: str


class TicketUser(BaseModel):
    user_id : int
    ticket_id: int
    class Config:
        from_attributes = True  