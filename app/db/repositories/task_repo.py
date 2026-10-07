from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.models.task import Task


class TaskRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, task_id: int) -> Optional[Task]:
        query = select(Task).where(Task.id == task_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_by_owner_id(
        self, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Task]:
        query = select(Task).where(Task.owner_id == owner_id).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Task]:
        query = select(Task).offset(skip).limit(limit)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create(self, task: Task) -> Task:
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def update(self, task: Task) -> Task:
        self.db.add(task)
        await self.db.flush()
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def delete(self, task: Task) -> None:
        await self.db.delete(task)
        await self.db.commit()
