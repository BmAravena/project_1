from fastapi import FastAPI
from api.router import api_router
from api.v1.endpoints import health
from core.config import settings

app = FastAPI(
    description="API REST para el Proyecto 1: Autenticación, Usuarios y Gestión con Postgres",
    docs_url="/docs",      # Interfaz gráfica de Swagger UI
    redoc_url="/redoc"     # Documentación alternativa en ReDoc
)

# Include routers for different API versions
app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": f"Bienvenido a {settings.PROJECT_NAME}",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
