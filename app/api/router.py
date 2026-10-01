from fastapi import APIRouter
from app.api.v1.endpoints import auth, health, user

api_router =  APIRouter()

api_router.include_router(health.router, 
                          prefix="", 
                          tags=["Health"])

api_router.include_router(user.router, 
                          prefix="", 
                          tags=["Users"])

api_router.include_router(auth.router, 
                          prefix="", 
                          tags=["Authentication"])