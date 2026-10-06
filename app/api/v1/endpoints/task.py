from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.db.models.task import Task
from app.db.models.user import User
from app.core.deps import get_current_user
from app.api.v1.schemas.task import TaskCreate, TaskResponse

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
        owner_id=current_user.id  # <-- Se asigna automáticamente al usuario logueado
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task


# --- 2. Listar Tareas (Con lógica de roles y propiedad) ---
@router.get("/", response_model=List[TaskResponse])
async def list_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Si es admin o staff, puede ver todas las tareas del sistema
    if current_user.role in ["admin", "staff"]:
        result = await db.execute(select(Task))
    else:
        # Si es un usuario común, solo ve SUS propias tareas
        result = await db.execute(select(Task).where(Task.owner_id == current_user.id))
        
    tasks = result.scalars().all()
    return tasks


# --- 3. Eliminar Tarea (Validando Ownership o Rols Altos) ---
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscar la tarea
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalars().first()

    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    # VALIDACIÓN DE PROPIEDAD: 
    # Solo puede borrarla si es el dueño O si es admin/staff
    if task.owner_id != current_user.id and current_user.role not in ["admin", "staff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para eliminar esta tarea"
        )

    await db.delete(task)
    await db.commit()
    return None