from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.db.models.task import Task
from app.db.models.user import User
from app.core.deps import get_current_user
from app.api.v1.schemas.task import TaskCreate, TaskResponse
from app.services.task_service import TaskService
from app.services.user_service import UserService

router = APIRouter()

# Create a new task (Authenticated users only)
@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_task = Task(
        title=task_in.title,
        description=task_in.description,
        owner_id=current_user.id  # <-- Set the owner_id to the current user's ID
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task


# List all tasks (Authenticated users only)
@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):  
    service = TaskService(db) # Create an instance of TaskService with the database session
    # If the user is an admin or staff, they can see all tasks; otherwise, they only see their own tasks.
    if current_user.role in ["admin", "staff"]:
        result = await service.get_all_tasks()
    else:
        # If the user is not an admin or staff, retrieve only their own tasks
        result = await service.get_tasks_by_owner(owner_id=current_user.id)
        
        
    #tasks = result.scalars().all()
    return result


# Delete a task by ID (Authenticated users only)
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = TaskService(db) # Create an instance of TaskService with the database session
    # Search for the task by ID
    result = await service.get_task_by_id(task_id)

    if not result:
        raise HTTPException(status_code=404, detail="Task not found")

    # validate ownership or roles (admin/staff) before allowing deletion
    # Only the owner of the task or users with "admin" or "staff" roles can delete the task
    if result.owner_id != current_user.id and current_user.role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this task"
        )

    await db.delete(result)
    await db.commit()
    return