from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.task import Task
from app.db.models.user import User
from app.db.repositories.task_repo import TaskRepository


class TaskService:
    def __init__(self, db: AsyncSession):
        self.repo = TaskRepository(db)

    async def create_task(
        self, title: str, description: Optional[str], owner_id: int
    ) -> Task:
        task = Task(
            title=title,
            description=description,
            owner_id=owner_id,
        )
        return await self.repo.create(task)

    async def get_task_by_id(self, task_id: int) -> Task:
        task = await self.repo.get_by_id(task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tarea no encontrada",
            )
        return task

    async def get_tasks_by_owner(
        self, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Task]:
        return await self.repo.get_by_owner_id(owner_id, skip=skip, limit=limit)

    async def get_all_tasks(
        self, skip: int = 0, limit: int = 100
    ) -> List[Task]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def update_task(
        self, task: Task, current_user: User
    ) -> Task:
        if task.owner_id != current_user.id and current_user.role not in {
            "admin",
            "staff",
        }:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para actualizar esta tarea",
            )
        return await self.repo.update(task)

    async def delete_task(self, task_id: int, current_user: User) -> None:
        task = await self.get_task_by_id(task_id)

        if task.owner_id != current_user.id and current_user.role not in {
            "admin",
            "staff",
        }:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para eliminar esta tarea",
            )

        await self.repo.delete(task)


