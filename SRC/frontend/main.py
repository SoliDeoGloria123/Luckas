import os
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

app = FastAPI()

current_dir = os.path.dirname(os.path.abspath(__file__))

# Si los directorios static y templates están en /app/SRC/frontend, usa:
static_path = os.path.join(current_dir, "static")
app.mount("/static", StaticFiles(directory=static_path), name="static")

templates_path = os.path.join(current_dir, "templates")
templates = Jinja2Templates(directory=templates_path)

# Página principal
@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("gest_personas.html", {"request": request})

# Página secundaria: Gestión de personas
#@app.get("/gestion_persona", name="gestion_persona")
#async def gestion_persona(request: Request):
 #   return templates.TemplateResponse("GestionPersona.html", {"request": request})

#Pagina segundaria: Gestion de pagos
#@app.get("/gestionpagos", name="gestionpagos")
#async def gestionpagos(request: Request):
 #   return templates.TemplateResponse("gestionpagos.html", {"request": request})