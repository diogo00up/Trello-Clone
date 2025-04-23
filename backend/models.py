from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

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
    ticket_owner = Column(Integer, ForeignKey("users.id"))
    ticket_class = Column(String(255))

class UserTicket(Base):
    __tablename__ = "user_ticket"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ticket_id = Column(Integer, ForeignKey("tickets.id"))


class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    group_name = Column(String(255))
  

class groupTicket(Base):
    __tablename__ = "group_tickets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(String(255))
    ticket_owner = Column(Integer, ForeignKey("users.id"))
    ticket_class = Column(String(255))
    group_id = Column(Integer, ForeignKey("groups.id"))
    date_created = Column(DateTime, default=func.now())

class user_group(Base):
    __tablename__ = "user_group"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    group_id = Column(Integer, ForeignKey("groups.id"))
    is_admin = Column(Boolean, default=False)

