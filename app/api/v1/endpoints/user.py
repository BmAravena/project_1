from fastapi import APIRouter, Depends, status
from api.v1.schemas.user import UserCreate, UserResponse, UserCreateDB, FakeUserResponse, FakeUserCreate
from services.user_service import UserService
from db.fake_db import fake_db_list

from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from services.user_service import UserService

router = APIRouter()


"""

@router.get("/users", response_model=list[FakeUserResponse], summary="Get all users")
async def get_users():
    
    #Retrieve a list of all users in the system.
    
    return fake_db_list 


@router.post("/users", response_model=FakeUserResponse, summary="Create a new fake user")
async def create_fake_user(user: FakeUserCreate):

    #Create a new user with the provided information.
    
    # Simulate user creation and return the created user with an ID
    new_user = {"id": len(fake_db_list) + 1, **user.dict()}
    fake_db_list.append(new_user)
    return new_user

"""

# SQLITE
@router.post(
    "/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user"
)
async def create_user(
    user_in: UserCreateDB, 
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new user in the database with the provided information.
    """
    service = UserService(db)
    return await service.create_user(user_in)


@router.get(
    "/users",
    response_model=list[UserResponse],
    summary="Get all users"
)
async def get_users(
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a list of all users in the database.
    """
    service = UserService(db)
    return await service.get_users(skip=skip, limit=limit)