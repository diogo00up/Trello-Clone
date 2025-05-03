from fastapi import  APIRouter, HTTPException
import os
import requests
from fastapi import  HTTPException
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from urllib.parse import urlencode
from .schemas import EventData
from fastapi import Header

router = APIRouter()

load_dotenv() 

CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")  
CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")  
REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")  
SCOPE = os.getenv("GOOGLE_API_SCOPE")  

OAUTH2_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
CALENDAR_API_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events"

@router.get("/auth/google")
async def google_login():
    auth_url = f"{OAUTH2_URL}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope={SCOPE}&response_type=code"
    return RedirectResponse(url=auth_url)

@router.get("/oauth2callback")
async def google_oauth_callback(code: str):
   
    token_data = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    response = requests.post(TOKEN_URL, data=token_data)
    response_data = response.json()

    if "access_token" in response_data:

        google_token = response_data["access_token"]
        params = urlencode({"google_token": google_token})
        return RedirectResponse(url=f"http://localhost:3000/oauth-success?{params}")

        #access_token = response_data["access_token"]
        #return {"access_token": google_token}
    else:
        raise HTTPException(status_code=400, detail="OAuth token exchange failed")


@router.post("/google/create_event")
async def create_google_calendar_event(event_data: EventData, authorization: str = Header(...)):
    headers = {"Authorization": authorization}
    response = requests.post(CALENDAR_API_URL, headers=headers, json=event_data.dict())

    if response.status_code == 200:
        return {"message": "Event created successfully", "event": response.json()}
    else:
        raise HTTPException(status_code=400, detail="Failed to create event")