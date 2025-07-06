import datetime
from fastapi import FastAPI, File, HTTPException, Query, Request, Form, Response, UploadFile, Depends, status
from fastapi.middleware.wsgi import WSGIMiddleware
from fastapi.responses import RedirectResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pathlib import Path
from flask import Flask, session, redirect, url_for, flash
from flask_bcrypt import Bcrypt # type: ignore
from flask_dance.contrib.google import make_google_blueprint, google
from pymongo import MongoClient
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeSerializer
from bson import ObjectId
import secrets
import base64
import re
from dotenv import load_dotenv
import os
from typing import List
from jinja2 import FileSystemLoader
#from SRC.backend.ofertas import data_analist_products

# Mapeo de categorías a términos de búsqueda
CATEGORIAS_MAPPING = {
    "frutas_verduras": ["fruta", "verdura", "hortaliza", "aguacate", "manzana", "plátano", "tomate", "cebolla", "papa"],
    "carnicos": ["carne", "res", "cerdo", "pollo", "pechuga", "lomo", "costilla", "hamburguesa", "salchicha"],
    "pescados": ["pescado", "mariscos", "atún", "salmón", "camarón", "tilapia", "trucha"],
    "panaderia": ["pan", "pastel", "torta", "galleta", "croissant", "dona", "muffin", "bizcocho"],
    "dulces_abarrotes": ["dulce", "chocolate", "caramelo", "azúcar", "arroz", "frijol", "pasta", "aceite", "conserva"],
    "bebidas": ["agua", "jugo", "refresco", "gaseosa", "cerveza", "vino", "leche", "café", "té"]
}

# Cargar variables de entorno desde .env
load_dotenv()

# Conectar a MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.LuckasEnt

# Colecciones
collection = db["productos"]
listas_collection = db["lists"]
users_collection = db["users"]

# Configurar correo electrónico
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

# Configurar clave secreta
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY no está configurada en el archivo .env")
print(f"--- DEBUG: SECRET_KEY cargada: {SECRET_KEY} ---")

serializer = URLSafeSerializer(SECRET_KEY)
print(f"--- DEBUG: Serializer inicializado: {serializer} ---")

# Crear la aplicación principal de FastAPI
app = FastAPI()

# Crear la subaplicación Flask
flask_app = Flask(__name__)
flask_app.secret_key = SECRET_KEY

# Hash de la contraseña
bcrypt = Bcrypt(flask_app)

# Configurar la Implementación de Google OAuth
google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_to="google_login_callback",
    scope=[
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ],
)

# Registrar el blueprint de Google OAuth
flask_app.register_blueprint(google_bp, url_prefix="/login/google")

# Ruta de inicio de sesión de Google
@flask_app.route("/login/google")
def google_login():
    return redirect(url_for("google.login"))

# Callback de Google OAuth
@flask_app.route("/google_login_callback")
def google_login_callback():
    print(f"--- DEBUG: Serializer en google_login_callback: {serializer} ---")
    print("--- DEBUG: Entrando a google_login_callback ---")
    
    # Verificar si el usuario ya está en sesión
    if 'usuario' in session:
        print(f"--- DEBUG: Usuario ya en sesión: {session['usuario']} ---")
        return redirect("/dashboard")

    # Verificar si el usuario está autorizado con Google
    if not google.authorized:
        print("--- DEBUG: Usuario no autorizado con Google ---")
        return redirect(url_for('google.login'))
    
    # Obtener información del usuario desde Google
    resp = google.get("https://www.googleapis.com/oauth2/v3/userinfo")
    if not resp.ok:
        print("--- DEBUG: Error al obtener información del usuario ---")
        flash("Error al obtener información del usuario de Google.", "error")
        return redirect("/login")
    
    user_info = resp.json()
    print(f"--- DEBUG: Información del usuario de Google: {user_info} ---")
    
    if 'email' not in user_info:
        print("--- DEBUG: No se pudo obtener el correo electrónico del usuario ---")
        flash("No se pudo obtener el correo electrónico del usuario.", "error")
        return redirect("/login")
    
    # Guardar o actualizar la información del usuario en la base de datos
    users_collection.update_one(
        {"correo": user_info.get("email")},
        {
            "$set": {
                "nombre": user_info.get("given_name"),
                "apellido": user_info.get("family_name"),
                "foto": user_info.get("picture"),  # Guardar la URL de la foto de perfil
            }
        },
        upsert=True  # Crear el documento si no existe
    )

    # Depuración: Verifica si la foto se guardó correctamente
    usuario = users_collection.find_one({"correo": user_info.get("email")})
    print(f"--- DEBUG: Usuario actualizado en la base de datos: {usuario} ---")
    
    # Configurar la cookie de sesión
    cookie_value = serializer.dumps({"email": user_info.get("email")})
    print(f"--- DEBUG: Valor de la cookie firmada: {cookie_value} ---")
    response = redirect("/dashboard")
    response.set_cookie(
        "session",
        cookie_value,
        httponly=True,
        max_age=86400,
        secure=False,
        samesite="Lax"
    )
    return response

# Montar la subaplicación Flask en FastAPI
app.mount("/flask", WSGIMiddleware(flask_app))

# Configurar templates y archivos estáticos
BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
app.mount("/images", StaticFiles(directory=BASE_DIR / "static" / "img"), name="images")

# Configuración personalizada de plantillas para usar ambas carpetas
loader = FileSystemLoader([
    BASE_DIR / "templates",
    BASE_DIR / "public"
])

templates = Jinja2Templates(directory=BASE_DIR / "templates")
templates.env.loader = loader

# Filtro personalizado para codificar en Base64
def b64encode_filter(data):
    if isinstance(data, bytes):  # Si es binario, codificar en Base64
        return base64.b64encode(data).decode("utf-8")
    elif isinstance(data, str):  # Si es una URL, devolverla tal cual
        return data
    return ""  # Si no hay datos, devolver una cadena vacía
templates.env.filters["b64encode"] = b64encode_filter

# Obtener el usuario actual desde la cookie
def get_current_user(request: Request):
    print("--- DEBUG: Entrando a get_current_user ---")
    session_cookie = request.cookies.get("session")
    print(f"--- DEBUG: Valor de la cookie recibida: {session_cookie} ---")
    if not session_cookie:
        print("--- DEBUG: No hay cookie, retornando None ---")
        return None
    try:
        data = serializer.loads(session_cookie)
        print(f"--- DEBUG: Cookie decodificada: {data} ---")
        return data
    except Exception as e:
        print(f"--- DEBUG: ERROR al decodificar cookie: {e} ---")
        return None
    
# Dependencia para verificar inicio de sesión
async def require_login(request: Request):
    print(">>> DEBUG: Entrando a require_login <<<")
    user_session_data = get_current_user(request)
    print(f">>> DEBUG: user_session_data es: {user_session_data} <<<")
    if not user_session_data:
        print(">>> DEBUG: NO hay sesión, REDIRIGIENDO a login <<<")
        return RedirectResponse(url="/login", status_code=status.HTTP_303_SEE_OTHER)
    print(">>> DEBUG: SI hay sesión, PERMITIENDO acceso <<<")
    return user_session_data

# Dependencia para rutas API
async def require_api_login(request: Request):
    """
    Dependencia para rutas API. Verifica login y devuelve 401 si no está autenticado.
    """
    user_session_data = get_current_user(request)
    if not user_session_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No autenticado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_session_data

# API endpoint for React app to check authentication status
@app.get("/api/auth/status")
async def auth_status(request: Request):
    """
    API endpoint for React app to check authentication status
    """
    user_session_data = get_current_user(request)
    if user_session_data:
        return {"authenticated": True, "user": user_session_data}
    else:
        return {"authenticated": False, "user": None}

# Serve React app for external role
@app.get("/react{path:path}")
async def serve_react_app(request: Request, path: str = ""):
    """
    Serve the React application for external role users
    """
    return FileResponse(str(BASE_DIR / "static" / "react-build" / "index.html"))

# Rutas de la aplicación FastAPI
@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/home", name="home")
async def home_route(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/login", name="login")
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.get("/login_principal", name="login_principal")
async def login_principal(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login", name="login_post")
async def login_post(request: Request, response: Response, email: str = Form(...), password: str = Form(...)):
    print(f"--- DEBUG: Serializer en login_post: {serializer} ---")
    if not email or not password:
        error = "Todos los campos son obligatorios"
        return templates.TemplateResponse(
            "login.html", {"request": request, "error": error}
        )

    usuario = users_collection.find_one({"correo": email})
    if usuario and bcrypt.check_password_hash(usuario["password"], password):
        session_data = {"email": email}
        session_cookie = serializer.dumps(session_data)
        response = RedirectResponse(url="/dashboard", status_code=303)
        response.set_cookie(key="session", value=session_cookie, httponly=True)
        return response
    else:
        error = "Correo o contraseña incorrectos"
        return templates.TemplateResponse(
            "login.html", {"request": request, "error": error}
        )

@app.get("/logout", name="logout")
async def logout(response: Response):
    response = RedirectResponse(url="/login", status_code=303)
    response.delete_cookie("session")
    return response

@app.get("/clear_cookies")
async def clear_cookies(response: Response):
    response = RedirectResponse(url="/login", status_code=303)
    response.delete_cookie("session")
    return response

@app.get("/registro", name="registro")
async def registro(request: Request):
    return templates.TemplateResponse("registro.html", {"request": request})

@app.post("/register", name="register_post")
async def register_post(
    request: Request,
    nombre: str = Form(...),
    apellido: str = Form(...),
    correo: str = Form(...),
    telefono: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
):
    if password != confirm_password:
        error = "Las contraseñas no coinciden"
        return templates.TemplateResponse(
            "registro.html", {"request": request, "error": error}
        )

    usuario_existente = users_collection.find_one({"correo": correo})
    if usuario_existente:
        error = "El correo ya está registrado"
        return templates.TemplateResponse(
            "registro.html", {"request": request, "error": error}
        )

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    nuevo_usuario = {
        "nombre": nombre,
        "apellido": apellido,
        "correo": correo,
        "telefono": telefono,
        "password": hashed_password,
    }
    users_collection.insert_one(nuevo_usuario)
    return RedirectResponse(url="/login", status_code=303)

@app.get("/olvidar", name="olvidar")
async def olvidar(request: Request):
    return templates.TemplateResponse("olvidar_contraseña.html", {"request": request})

@app.post("/olvidar", name="olvidar_post")
async def olvidar_post(request: Request, email: str = Form(...)):
    usuario = users_collection.find_one({"correo": email})
    if not usuario:
        return templates.TemplateResponse(
            "olvidar_contraseña.html", {"request": request, "error": "Si este correo está registrado, recibirás instrucciones para restablecer tu contraseña."}
        )

    token = secrets.token_urlsafe(32)
    expiry_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)

    users_collection.update_one(
        {"correo": email},
        {"$set": {"reset_token": token, "reset_token_expiry": expiry_time}}
    )

    try:
        reset_url = request.url_for('mostrar_reset_form', token=token)
    except Exception as e:
        print(f"Error generando URL con url_for: {e}. Construyendo manualmente.")
        base_url = str(request.base_url).rstrip('/')
        reset_url = f"{base_url}/restablecer_pass?token={token}"

    print(f"--- DEBUG: Reset URL generada: {reset_url} ---")

    sender_email = SENDER_EMAIL
    sender_password = SENDER_PASSWORD
    subject = "Restablece tu contraseña - LuckasEnt"
    body = f"""Hola {usuario.get('nombre', 'Usuario')},

Hemos recibido una solicitud para restablecer tu contraseña en LuckasEnt.

Haz clic en el siguiente enlace para establecer una nueva contraseña:
{reset_url}

Si no solicitaste esto, puedes ignorar este correo. Este enlace expirará en 1 hora.

Saludos,
El equipo de LuckasEnt"""

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
        return templates.TemplateResponse(
            "olvidar_contraseña.html", {"request": request, "success": "Si este correo está registrado, recibirás instrucciones para restablecer tu contraseña."}
        )
    except Exception as e:
        print(f"Error al enviar correo de restablecimiento: {e}")
        return templates.TemplateResponse(
            "olvidar_contraseña.html", {"request": request, "error": "No se pudo enviar el correo de restablecimiento. Inténtalo más tarde."}
        )

@app.get("/restablecer_pass", name="mostrar_reset_form")
async def mostrar_reset_form(request: Request, token: str = Query(...)):
    now = datetime.datetime.utcnow()
    usuario = users_collection.find_one({
        "reset_token": token,
        "reset_token_expiry": {"$gt": now}
    })

    if not usuario:
        return templates.TemplateResponse(
            "error.html",
            {"request": request, "status_code": 400, "detail": "El enlace de restablecimiento no es válido o ha expirado. Por favor, solicita uno nuevo."},
            status_code=400
        )

    return templates.TemplateResponse(
        "restablecer_form.html",
        {"request": request, "token": token}
    )

@app.post("/restablecer_pass", name="procesar_reset_form")
async def procesar_reset_form(
    request: Request,
    token: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...)
):
    if new_password != confirm_password:
        return templates.TemplateResponse(
            "restablecer_form.html",
            {"request": request, "token": token, "error": "Las contraseñas no coinciden."}
        )

    now = datetime.datetime.utcnow()
    usuario = users_collection.find_one({
        "reset_token": token,
        "reset_token_expiry": {"$gt": now}
    })

    if not usuario:
        return templates.TemplateResponse(
            "error.html",
            {"request": request, "status_code": 400, "detail": "El enlace de restablecimiento no es válido o ha expirado."},
            status_code=400
        )

    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    users_collection.update_one(
        {"_id": usuario["_id"]},
        {
            "$set": {"password": hashed_password},
            "$unset": {"reset_token": "", "reset_token_expiry": ""}
        }
    )

    login_url = request.url_for('login')
    response = RedirectResponse(url=f"{login_url}?reset_success=true", status_code=status.HTTP_303_SEE_OTHER)
    return response

@app.get("/dashboard", name="dashboard")
async def dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.get("/perfil", name="perfil")
async def perfil(request: Request, current_user = Depends(require_login)):
    if isinstance(current_user, RedirectResponse):
        return current_user

    usuario = users_collection.find_one({"correo": current_user["email"]})
    print(f"--- DEBUG: Usuario obtenido para /perfil: {usuario} ---")
    if not usuario:
        return RedirectResponse(url=request.url_for('login'), status_code=status.HTTP_303_SEE_OTHER)
    return templates.TemplateResponse("perfil.html", {"request": request, "usuario": usuario})

@app.post("/perfil", name="actualizar_perfil")
async def actualizar_perfil(
    request: Request,
    nombre: str = Form(...),
    apellido: str = Form(...),
    email: str = Form(...),
    telefono: str = Form(...),
    password: str = Form(...),
    foto: UploadFile = File(None),
    current_user = Depends(require_login)
):
    if isinstance(current_user, RedirectResponse):
        return current_user
        
    if email != current_user["email"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permiso para actualizar este perfil")
     
    update_data = {
        "nombre": nombre,
        "apellido": apellido,
        "telefono": telefono,
        "correo": email,
        "password": password,
    }
    
    if foto and foto.filename:
        contenido_foto = await foto.read()
        update_data["foto"] = contenido_foto

    result = users_collection.update_one(
        {"correo": email},
        {"$set": update_data},
    )
    return RedirectResponse(url=request.url_for('cuenta'), status_code=303)

@app.get("/cuenta", name="cuenta")
async def cuenta(request: Request, current_user = Depends(require_login)):
    if isinstance(current_user, RedirectResponse):
        return current_user

    usuario = users_collection.find_one({"correo": current_user["email"]})
    print(f"--- DEBUG: Usuario obtenido para /cuenta: {usuario} ---")
    if not usuario:
        return RedirectResponse(url=request.url_for('login'), status_code=status.HTTP_303_SEE_OTHER)
    return templates.TemplateResponse("Mi_Cuenta.html", {"request": request, "usuario": usuario})

@app.post("/eliminar_cuenta", name="eliminar_cuenta")
async def eliminar_cuenta(request: Request, email: str = Form(...)):
    result = users_collection.delete_one({"correo": email})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return RedirectResponse(url="/registro", status_code=303)

@app.get("/inscripcion_home", name="inscripcion_home")
async def inscripcion_home(request: Request, evento: str = None):
    return templates.TemplateResponse("inscripcion_home.html", {"request": request, "evento": evento})

@app.get("/inscripcion", name="inscripcion")
async def inscripcion(request: Request, evento: str = None, current_user = Depends(require_login)):
    if isinstance(current_user, RedirectResponse):
        return current_user
        
    usuario = users_collection.find_one({"correo": current_user["email"]})
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return templates.TemplateResponse("inscripcion.html", {"request": request, "evento": evento, "usuario": usuario})

@app.get("/programa", name="programa")
async def program_inscripcion(request: Request):
    return templates.TemplateResponse("programa-servicio-cristiano.html", {"request": request})

@app.get("/programas-academicos", name="programas-academicos")
async def programa_academicos(request: Request):
    return templates.TemplateResponse("programa-servicio-cristiano.html", {"request": request})

@app.get("/programa-servicio-cristiano", name="programa_servicio_cristiano")
async def programa_servicio_cristiano(request: Request):
    return templates.TemplateResponse("programa-servicio-cristiano.html", {"request": request})

@app.get("/programa-teologia-pastoral", name="programa_teologia_pastoral")
async def programa_teologia_pastoral(request: Request):
    return templates.TemplateResponse("programa-servicio-cristiano.html", {"request": request})

@app.get("/eventos", name="eventos")
async def eventos(request: Request):
    return templates.TemplateResponse("eventos.html", {"request": request})

@app.get("/cursos_home", name="cursos_home")
async def cursos_home(request: Request):
    return templates.TemplateResponse("cursos_home.html", {"request": request})

@app.get("/cursos", name="cursos")
async def cursos(request: Request):
    return templates.TemplateResponse("cursos_home.html", {"request": request})

@app.get("/cursos-intensivos", name="cursos_intensivos")
async def cursos_intensivos(request: Request):
    return templates.TemplateResponse("cursos_home.html", {"request": request})

@app.get("/tienda", name="tienda")
async def tienda(request: Request, current_user = Depends(require_login)): 
    if isinstance(current_user, RedirectResponse):
        return current_user
        
    print(f"### DEBUG: tienda - Usuario en /tienda: {current_user.get('email')} ###")
    usuario = users_collection.find_one({"correo": current_user["email"]})

    if not usuario:
        return RedirectResponse(url=request.url_for('logout'), status_code=status.HTTP_303_SEE_OTHER)

    return templates.TemplateResponse("tienda.html", {"request": request, "usuario": usuario})

@app.get("/productlista", name="productlista")
async def productlista(request: Request):
    return templates.TemplateResponse("categorias.html", {"request": request})

@app.get("/tulista", name="tulista")
async def tulista(request: Request, current_user = Depends(require_login)):
    if isinstance(current_user, RedirectResponse):
        return current_user
        
    print(f"### DEBUG: categoria - Usuario en /categoria: {current_user.get('email')} ###")
    
    user_email = current_user["email"]
    lista_doc = listas_collection.find_one({"user_email": user_email})
    productos_lista_completa = []
    
    if lista_doc and "productos_ids" in lista_doc: 
        lista_ids = lista_doc.get("productos_ids", [])
        if lista_ids:
            productos_lista_completa = list(collection.find({"_id": {"$in": lista_ids}}))

    usuario_info = users_collection.find_one({"correo": user_email})
    if not usuario_info:
        usuario_info = {'foto': None, 'nombre': 'Usuario', 'apellido': ''}

    return templates.TemplateResponse(
        "cardgrid.html",
        {
            "request": request,
            "productos_lista": productos_lista_completa,
            "usuario": usuario_info
        }
    )

@app.post("/eliminar_de_lista/{product_id}", name="eliminar_de_lista")
async def eliminar_de_lista(request: Request, product_id: str):
    user_session_data = get_current_user(request)
    if not user_session_data:
        raise HTTPException(status_code=401, detail="No autenticado")

    user_email = user_session_data["email"]

    try:
        obj_product_id = ObjectId(product_id)
    except Exception:
        raise HTTPException(status_code=400, detail="ID de producto inválido")

    result = listas_collection.update_one(
        {"user_email": user_email},
        {"$pull": {"productos_ids": obj_product_id}}
    )

    if result.modified_count > 0:
        return {"status": "success", "message": "Producto eliminado de la lista"}
    elif result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lista de usuario no encontrada")
    else:
        return {"status": "info", "message": "Producto no encontrado en la lista"}

@app.get("/nosotros", name="nosotros")
async def nosotros(request: Request):
    return templates.TemplateResponse("nosotros.html", {"request": request})

@app.get("/termino", name="termino")
async def termino(request: Request):
    return templates.TemplateResponse("Termino_uso.html", {"request": request})

@app.get("/index", name="index")
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/notificaciones", name="notificaciones")
async def notificaciones(request: Request, current_user = Depends(require_login)):
    if isinstance(current_user, RedirectResponse):
        return current_user
    
    usuario = users_collection.find_one({"correo": current_user["email"]})
    if not usuario:
        return RedirectResponse(url=request.url_for('login'), status_code=status.HTTP_303_SEE_OTHER)
    
    return templates.TemplateResponse("notificaciones.html", {"request": request, "usuario": usuario})

@app.get("/contacto", name="contacto")
async def contacto(request: Request):
    return templates.TemplateResponse("contacto.html", {"request": request})

# Manejadores de excepciones
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    return templates.TemplateResponse(
        "error.html",
        {"request": request, "status_code": exc.status_code, "detail": exc.detail},
        status_code=exc.status_code,
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return templates.TemplateResponse(
        "error.html",
        {"request": request, "status_code": 422, "detail": "Error de validación"},
        status_code=422,
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return templates.TemplateResponse(
        "error.html",
        {"request": request, "status_code": 500, "detail": "Error interno del servidor"},
        status_code=500,
    )