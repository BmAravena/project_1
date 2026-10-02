from fastapi import APIRouter, Depends, status
from app.api.v1.schemas.user import UserCreateDB, UserResponse
from app.services.user_service import UserService

from app.db.models.user import User
from app.core.deps import get_current_user

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db

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

# testing purposes
@router.get("/users/me")
async def get_my_user_profile(current_user: User = Depends(get_current_user)):
    """
    protected endpoint to get the profile of the currently authenticated user.
    """
    return {
        "full_name": current_user.full_name,
        "email": current_user.email,
        "created_at": current_user.created_at,
        # You can return other fields from your model that are not sensitive (like the password)
    }


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


@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    summary="Get user by ID"
)
async def get_user_by_id(
    user_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieve a user from the database by their ID.
    """
    service = UserService(db)
    return await service.get_user_by_id(user_id)

@router.delete(
    "/users/{user_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete user by ID")
async def delete_user(
    user_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a user from the database by their ID.
    """
    service = UserService(db)
    await service.delete_user_by_id(user_id)
    return {"message": "User deleted successfully"}


