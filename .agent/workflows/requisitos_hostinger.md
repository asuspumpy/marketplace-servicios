---
description: Desplegar el Marketplace de Servicios en Hostinger
---
# Despliegue en Hostinger

Este flujo de trabajo contiene los pasos necesarios y los requisitos del sistema para desplegar la aplicación "Marketplace de Servicios" (que consta de un Frontend en React/Vite y un Backend en Node.js) en un entorno de alojamiento compartido o VPS de Hostinger.

## 1. Requisitos Previos en Hostinger

Antes de subir el código, asegúrate de tener configurado lo siguiente en tu panel de Hostinger:

- **Dominio o Subdominio:** Un dominio apuntando correctamente al servidor.
- **Base de Datos MySQL:** Crear una base de datos MySQL, un usuario y asignar todos los privilegios. Anotar las credenciales (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
- **Versión de Node.js:** Si usas el entorno compartido (Web Hosting), asegúrate de tener habilitada la herramienta de Node.js (idealmente versión 18+).
- **Acceso SSH (Recomendado):** Habilitar el acceso SSH para poder ejecutar comandos de instalación y construcción en el servidor directamente, aunque también puedes compilar en local y subir los archivos.

## 2. Preparación del Proyecto (Entorno Local)

### Backend (Node.js)
El backend debe estar preparado para funcionar detrás de un proxy inverso (como Apache o LiteSpeed de Hostinger).

1. **Variables de Entorno:**
   Asegúrate de tener un archivo `.env.hostinger` preparado con las credenciales de producción:
   ```env
   NODE_ENV=production
   PORT= (El puerto que te asigne Hostinger o 3000 si usas VPS, si es compartido suele ignorarse)
   DB_HOST=localhost (O la IP del servidor MySQL de Hostinger)
   DB_USER=tu_usuario_hostinger
   DB_PASSWORD=tu_password_hostinger
   DB_NAME=tu_base_de_datos_hostinger
   JWT_SECRET=tu_secreto_seguro
   CORS_ORIGIN=https://tudominio.com
   ```
2. **Ajuste del `server.js`:**
   El archivo principal (`server.js` o `index.js`) debe escuchar en el puerto proporcionado por el entorno, o tener un mecanismo para integrarse con Passenger si se usa alojamiento compartido:
   ```javascript
   const port = process.env.PORT || 3000;
   ```
3. **Paquetes:** Verifica que `package.json` tenga los scripts correctos (`start: "node server.js"`).

### Frontend (React/Vite)
1. **Variables de Entorno (Frontend):**
   Configura la URL base de tu API apuntando al dominio en producción en un archivo `.env.production` dentro de la carpeta frontend:
   ```env
   VITE_API_URL=https://tudominio.com/api
   ```
2. **Compilación:**
   Genera los archivos estáticos listos para producción.
   ```bash
   cd frontend
   npm run build
   ```
   Esto generará una carpeta `dist` (o `build`).

## 3. Subida de Archivos al Servidor

Dependiendo si es Web Hosting (Compartido) o VPS:

### Opción A: Web Hosting Compartido (Panel de Control Hpanel)
1. **Frontend:**
   Sube el contenido de la carpeta `frontend/dist` o `frontend/build` a la carpeta `public_html` de tu dominio.
2. **Backend:**
   Sube los archivos del backend (incluyendo `server.js`, `package.json`, carpetas `routes`, `controllers`, etc.) a una carpeta protegida o específica configurada en la herramienta "Node.js" del hPanel. **NO subas** la carpeta `node_modules`.
3. **Instalación de dependencias:**
   Usar la interfaz de Hostinger para Node.js y presionar el botón de "Install Dependencies" o acceder por SSH y ejecutar `npm install --production`.
4. **.htaccess para Frontend (Importante):**
   Crea o modifica el archivo `.htaccess` en tu `public_html` para que las rutas de React no den error 404 al recargar:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Opción B: VPS (Servidor Virtual Privado)
1. Sube todo el código usando Git (`git clone ...`) o SCP.
2. Accede por SSH.
3. Instala Node.js y PM2.
4. Navega a la carpeta del backend, instala dependencias (`npm install`) y arranca con PM2:
   ```bash
   pm2 start server.js --name "marketplace-api"
   ```
5. Configura un servidor web como Nginx o Apache como Reverse Proxy para dirigir el tráfico del dominio al puerto de Node.js.

## 4. Resolución de Errores Comunes en Hostinger

- **Error 500 / 503 (Passenger/Node.js):**
  A menudo ocurre en alojamiento compartido si falta el archivo `.htaccess` necesario para iniciar Passenger, o si el script de inicio declarado en el hPanel no coincide con el real (ej. `app.js` vs `server.js`). Revisa que el _Startup File_ esté bien apuntado en la configuración de la app Node del panel.
- **Error CORS:**
  Asegúrate de que el backend en `server.js` permita solicitudes desde el dominio exacto (`https://tudominio.com`), incluyendo o excluyendo las 'www', y maneje correctamente los preflight (OPTIONS).
- **Problemas de conexión a MySQL:**
  Si la base de datos está en el mismo plan de Hostinger, el host suele ser `127.0.0.1` o `localhost`. Verifica que el usuario de la DB tenga añadidos los permisos.
- **Rutas de React dan 404 al recargar:**
  Falta el archivo `.htaccess` configurado en `public_html` redirigiendo todo al `index.html` (ver paso 3 Opción A).

## 5. Script de Verificación Pre-Despliegue Local

Antes de subir, asegúrate de correr en local simulando producción:
```bash
# Entorno simulado localmente
SET NODE_ENV=production
node server.js
```
Verifica que las variables no apunten a rutas de desarrollo (`http://localhost...`) en los logs.
