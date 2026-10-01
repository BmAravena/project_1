from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    """Response sent to the client when authentication is successful."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Structure of the data contained within the JWT payload."""
    email: str | None = None

