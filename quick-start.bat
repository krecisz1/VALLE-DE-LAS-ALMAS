@echo off
setlocal enabledelayedexpansion

:: 🌸 Valle de las Almas - Quick Start Script para Windows
:: Este script configura el proyecto automáticamente

echo 🌸 Iniciando configuración de Valle de las Almas...
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js 18.0.0 o superior.
    echo 🔗 Descarga desde: https://nodejs.org/
    pause
    exit /b 1
)

:: Obtener versión de Node.js
for /f "tokens=1" %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%

echo ✅ Node.js %NODE_VERSION% - Compatible
echo.

:: Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm no está instalado. Por favor instala npm.
    pause
    exit /b 1
)

echo 📦 Instalando dependencias...
npm install

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas correctamente
echo.

echo ⚙️ Ejecutando configuración inicial...
npm run setup

if %errorlevel% neq 0 (
    echo ❌ Error en la configuración inicial
    pause
    exit /b 1
)

echo ✅ Configuración completada
echo.

echo 🎉 ¡Valle de las Almas está listo!
echo.
echo 📝 Comandos disponibles:
echo    npm run dev     - Iniciar servidor de desarrollo
echo    npm run build   - Construir para producción
echo    npm run preview - Vista previa de producción
echo    npm run lint    - Verificar código con ESLint
echo.
echo 🌐 Para iniciar el desarrollo, ejecuta:
echo    npm run dev
echo.
echo 📚 Consulta README.md para más información
echo 💝 ¡Honrando la memoria de nuestros seres queridos! 🌸
echo.

pause