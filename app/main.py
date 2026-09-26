from fastapi import FastAPI

app = FastAPI(
    description="API REST para el Proyecto 1: Autenticación, Usuarios y Gestión con Postgres",
    docs_url="/docs",      # Interfaz gráfica de Swagger UI
    redoc_url="/redoc"     # Documentación alternativa en ReDoc
)


@app.get("/")
async def read_root():
    return {"Hello": "World"}
