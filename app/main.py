from fastapi import FastAPI
from app.api.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST para el Proyecto 1: Autenticación, Usuarios y Gestión con Postgres",
    docs_url="/docs",      # Interfaz gráfica de Swagger UI
    redoc_url="/redoc"    # Documentación alternativa en ReDoc
  # Nombre del documento
)


# Startup event to create database tables
@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Include routers for different API versions
app.include_router(api_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": f"Bienvenido a {settings.PROJECT_NAME}",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
