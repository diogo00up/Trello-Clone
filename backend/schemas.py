from pydantic import BaseModel
from datetime import date
from typing import List

# Modelo Pydantic para serialização dos dados

class RoleResponse(BaseModel):
    is_admin: int
    class Config:
        from_attributes = True  

class GroupResponse(BaseModel):
    id: int
    group_name: str

    class Config:
        from_attributes = True  
        

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

class GroupTicketCreate(BaseModel):
    title: str
    description: str
    group_id: int
    
    class Config:
        from_attributes = True  

class TicketUpdate(BaseModel):
    ticket_id: int
    ticket_class: str
    class Config:
        from_attributes = True  

class TicketTextTitleUpdate(BaseModel):
    id: int
    title : str
    text : str
    class Config:
        from_attributes = True  

class TicketDelete(BaseModel):
    id: int
    class Config:
        from_attributes = True  

class TicketUser(BaseModel):
    user_id : int
    ticket_id: int
    class Config:
        from_attributes = True  

class GroupTicketResponse(BaseModel):
    id: int
    title: str
    description: str
    ticket_owner: int
    ticket_class: str
    group_id: int
    date_created: date

    class Config:
        orm_mode = True

class DateUpdate(BaseModel):
    id : int
    date: date

    class Config:
        orm_mode = True

class UserGroupCreate(BaseModel):
    user_id : int
    group_id: int

    class Config:
        orm_mode = True

class UserGroupUpdate(BaseModel):
    user_id : int
    group_id : int
    is_admin: int
    
    class Config:
        orm_mode = True



