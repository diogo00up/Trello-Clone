from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import users, tickets
from .utils.logging import configure_logging

app = FastAPI()

# Configure logging
configure_logging()

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(tickets.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Trello Clone API!"}
