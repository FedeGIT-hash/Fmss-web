@echo off
echo Verificando instalacion de Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js no esta instalado o no esta en el PATH.
    echo Por favor, instala Node.js desde https://nodejs.org/ y vuelve a intentar.
    pause
    exit /b
)

echo Instalando dependencias del cliente...
cd client
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias del cliente.
    pause
    exit /b
)

echo Instalando dependencias del servidor...
cd ../server
call npm install
if %errorlevel% neq 0 (
    echo Error al instalar dependencias del servidor.
    pause
    exit /b
)

echo Todo listo! Para iniciar el proyecto:
echo 1. Abre una terminal y ve a la carpeta client y ejecuta: npm run dev
echo 2. Abre otra terminal y ve a la carpeta server y ejecuta: npm start
pause
