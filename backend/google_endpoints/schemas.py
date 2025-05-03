from pydantic import BaseModel
from datetime import date


class EventData(BaseModel):
    summary: str
    description: str
    start: dict
    end: dict