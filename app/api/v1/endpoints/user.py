from fastapi import APIRouter
from api.v1.schemas.user import UserCreate, UserResponse, FakeUserResponse, FakeUserCreate
from db.fake_db import fake_db_list

router = APIRouter()


@router.get("/users", response_model=list[FakeUserResponse], summary="Get all users")
async def get_users():
    """
    Retrieve a list of all users in the system.
    """
    return fake_db_list 


@router.post("/users", response_model=FakeUserResponse, summary="Create a new fake user")
async def create_fake_user(user: FakeUserCreate):
    """
    Create a new user with the provided information.
    """
    # Simulate user creation and return the created user with an ID
    new_user = {"id": len(fake_db_list) + 1, **user.dict()}
    fake_db_list.append(new_user)
    return new_user
