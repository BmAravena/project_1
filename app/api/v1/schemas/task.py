from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    owner_id: Optional[int] = None  # Only admins/staff can assign tasks to another user

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    completed: bool
    owner_id: int

    class Config:
        from_attributes = True  # Allows Pydantic to read data from ORM models directly