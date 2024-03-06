# Word Cloud Escape

Es un juego para una sala de escape.

Hay que ordenar las frases en sus correspondientes columnas para ascender a la nube 😇☁️

Al ganar manda un `100` por el puerto serie elegido desde el menú oculto abajo a la izquierda, que desaparece al elegir.

# Note

Esta app corre en Chromium (pero no anda bien en touchscreens).

En Firefox anda bien en touchscreens, pero necesita el backend para manejar la comunicación serie.

# Dev

## Frontend

`npm i && npm run dev`

## Backend

`cd backend`

`npm i && npm run dev`

# Prod Firefox

`npm i`

`npm run build`

`cd backend`

`npm run install`z

`npm run start` ??? mejor usar PM2

Go to [http://localhost:3000](http://localhost:3000)

# La fácil

Una vez instaladas todas las deps:

`sh start.sh`

o

`chmod +x start.sh` una vez y luego `./start.sh`
