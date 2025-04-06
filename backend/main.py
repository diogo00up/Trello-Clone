import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from endpoints import router as endpoints_router



logging.basicConfig(
    level=logging.INFO,  # You can use DEBUG, INFO, WARNING, ERROR, CRITICAL depending on your needs
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.FileHandler('app_errors.log'), logging.StreamHandler()]
)

# FastAPI app setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(endpoints_router)

@app.get("/")
async def root():
    return {"message": "Welcome to Trello Clone API! Switch endpoints(users, tickets) to get the information you need!"}

