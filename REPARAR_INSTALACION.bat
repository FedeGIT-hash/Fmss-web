@echo off
echo ==========================================
echo REPARANDO INSTALACION (GSAP y otras dependencias)
echo ==========================================
cd client

echo 1. Verificando NPM...
where npm
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: No se encuentra 'npm'. Asegurate de tener Node.js instalado.
    pause
    exit
)

echo.
echo 2. Instalando GSAP y @gsap/react...
call npm install gsap @gsap/react

echo.
echo 3. Instalando resto de dependencias...
call npm install

echo.
echo ==========================================
echo LISTO! Ahora cierra esta ventana y ejecuta ABRIR_SISTEMA.bat
echo ==========================================
pause
