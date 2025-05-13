# Imagen base oficial de Python (versión slim para menos peso)
FROM python:3.12-slim

WORKDIR /app  

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/.

# Aquí ajustamos para que la raíz de los módulos sea la carpeta SRC
ENV PYTHONPATH=/app/SRC
ENV OAUTHLIB_INSECURE_TRANSPORT=1

EXPOSE 5001

# Actualizamos el comando de inicio, ya que la aplicación está en frontend/main.py dentro de SRC
CMD ["uvicorn", "frontend.main:app", "--reload", "--host", "0.0.0.0", "--port", "5001"]



#https://www.youtube.com/watch?v=DoZZiSxXLJs


#docker build -t luckasent .                                                              NOTA: PARA CREAR LA IMAGEN
#docker run -p 5001:5001 --network=host luckasent                                         NOTA: PARA VERLO EN EL LOCAL UNA VEZ SIN RECARGAR
#docker run -p 5001:5001 --network=host -v $(pwd)/SRC:/app/SRC luckasent                  NOTA:LO MISMO QUE EL ANTERIOR SOLO QUE CADA VEZ QUE SE HAGA CAMBIOS EN EL CODIGO SE ACTUALIZA
#docker run -p 5001:5001 -v $(pwd)/SRC:/app/SRC luckasent
#docker run -p 5001:5001 -v $(pwd)/SRC:/app/SRC --env-file .env luckasent                 NOTA: SE UTILIZA PARA CARGAR VARIABLES DE ENTORNO EN EL CONTENEDOR
#docker image rmi -f luckasent                                                            NOTA: se utiliza para eliminar una imagen de Docker de tu sistema
#uvicorn front_end.main:app --reload