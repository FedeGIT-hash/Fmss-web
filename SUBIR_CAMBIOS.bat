@echo off
echo Subiendo cambios a GitHub...
git add .
git commit -m "feat: add RotatingText animation to login page"
git push
echo.
echo Cambios subidos exitosamente!
pause