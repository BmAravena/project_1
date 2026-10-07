from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.models.task import Task
from app.db.models.user import User
from app.db.repositories.task_repo import TaskRepository


async def test_task_repository_crud_and_owner_filtering():
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    session_factory = async_sessionmaker(engine, class_=AsyncSession)

    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    async with session_factory() as db:
        user = User(
            email="owner@example.com",
            hashed_password="hashed-password",
            full_name="Task Owner",
        )
        db.add(user)
        await db.flush()

        task = Task(
            title="Write tests",
            description="Create repository tests",
            owner_id=user.id,
        )
        repository = TaskRepository(db)

        created_task = await repository.create(task)
        assert created_task.id is not None

        fetched_task = await repository.get_by_id(created_task.id)
        assert fetched_task is not None
        assert fetched_task.title == "Write tests"

        owner_tasks = await repository.get_by_owner_id(user.id)
        assert len(owner_tasks) == 1
        assert owner_tasks[0].id == created_task.id

        fetched_task.completed = True
        updated_task = await repository.update(fetched_task)
        assert updated_task.completed is True

        await repository.delete(fetched_task)
        assert await repository.get_by_id(created_task.id) is None

    await engine.dispose()
