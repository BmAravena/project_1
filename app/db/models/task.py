from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base  # O la clase base de SQLAlchemy que estés usando


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    
    # Foreign key to link the task to its owner (user)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship to the User model to access the owner of the task
    owner = relationship("User", back_populates="tasks", lazy="selectin")