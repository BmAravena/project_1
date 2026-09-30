# app/services/user_service.py
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.repositories.user_repo import UserRepository
from app.api.v1.schemas.user import UserCreateDB


class UserService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def create_user(self, user_in: UserCreateDB) -> User:
        # Verify if the email is already registered 
        existing_user = await self.repo.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo electrónico ya está registrado."
            )

        # Crear instancia de User (Por ahora guardamos password directo para probar, 
        # en la fase de auth se agregará el hash con Passlib/Bcrypt)
        new_user = User(
            email=user_in.email,
            hashed_password=user_in.hashed_password,
            full_name=user_in.full_name,
            is_active=user_in.is_active
        )

        return await self.repo.create(new_user)

    async def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def get_user_by_id(self, user_id: int) -> User:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado"
            )
        return user