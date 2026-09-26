from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    health check endpoint to verify if the service is running and healthy.
    """
    return {"status": "Service is healthy"}
