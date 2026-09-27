from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


# --- Base Schema (Shared attributes) ---
class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    full_name: Optional[str] = None


# --- Request Schemas (Inputs) ---
class UserCreate(UserBase):
    """Required fields for creating a new user."""
    password: str


class UserUpdate(BaseModel):
    """Optional fields for updating the user's profile."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


# --- Response Schemas (Outputs) ---
class UserResponse(UserBase):
    """
    Schema for returning user information in API responses.
    """
    id: int

    # configuration for Pydantic model to allow ORM mode
    model_config = ConfigDict(from_attributes=True)