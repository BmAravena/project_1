from typing import Dict
from pydantic import BaseModel

# --- Response Schema for Health Check ---
class HealthResponse(BaseModel):
    status: str
    dependencies: Dict[str, str]