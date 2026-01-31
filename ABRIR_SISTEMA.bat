@echo off
TITLE FMSS Launcher
CLS

ECHO Verificando si Node.js esta instalado...
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO.
    ECHO [ERROR] Node.js no se encontro en tu sistema.
    ECHO.
    ECHO Para usar la pagina web, necesitas instalar Node.js primero:
    ECHO 1. Ve a: https://nodejs.org/
    ECHO 2. Descarga e instala la version "LTS".
    ECHO 3. Cierra esta ventana y vuelve a ejecutar este archivo.
    ECHO.
    PAUSE
    EXIT /B
)

ECHO.
ECHO Node.js detectado correctamente.
ECHO.

IF NOT EXIST "client\node_modules" (
    ECHO Primera vez ejecutando? Instalando dependencias necesarias...
    ECHO Esto puede tardar unos minutos...
    cd client
    call npm install
    cd ..
)

ECHO.
ECHO Iniciando el sistema FMSS...
ECHO Se abrira tu navegador automaticamente.
ECHO.
cd client
call npm run dev
PAUSE
