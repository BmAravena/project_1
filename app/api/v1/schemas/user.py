from dataclasses import field
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field


# --- Base Schema (Shared attributes) ---
class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    full_name: Optional[str] = None
    role: str = "user"

# --- Request Schemas (Inputs) ---
class UserCreate(UserBase):
    """Required fields for creating a new user."""
    password: str = Field(min_length=8, max_length=30)


class UserCreateDB(UserBase):
    """Fields persisted when creating a user in the database."""
    hashed_password: str


class UserUpdate(BaseModel):
    """Optional fields for updating the user's profile."""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


# --- Response Schemas (Outputs) ---
class UserResponse(UserBase):
    """
    Schema for returning user information in API responses.
    """
    id: int
   

    # configuration for Pydantic model to allow ORM mode
    model_config = ConfigDict(from_attributes=True)




class FakeUserBase(BaseModel):
    """
    Base schema for a fake user in the system.
    """
    email: EmailStr
    full_name: Optional[str] = None

class FakeUserCreate(FakeUserBase):
    """
    Schema for creating a fake user in the system.
    """
    password: str = Field(min_length=8, max_length=30)

# Temporary output user schema for testing purposes
class FakeUserResponse(FakeUserBase):
    """
    Schema for returning fake user information in API responses.
    """
    pass