from fastapi import APIRouter
from app.api.v1.schemas.health import HealthResponse


router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Health Check Endpoint")
async def health_check():
    """
    health check endpoint to verify if the service is running and healthy.
    """
    return HealthResponse(status="Service is healthy")