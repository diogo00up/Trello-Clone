from pydantic import BaseModel
from datetime import date

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



