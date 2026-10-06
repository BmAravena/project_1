from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base  # O la clase base de SQLAlchemy que estés usando

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    
    # Llave foránea para relacionar la tarea con el usuario propietario
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relación inversa opcional para navegar desde el usuario a sus tareas
    owner = relationship("User", back_populates="tasks")