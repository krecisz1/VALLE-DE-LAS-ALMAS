@echo off
setlocal enabledelayedexpansion

:: 🌸 Valle de las Almas - GitHub Export Script para Windows
:: Este script automatiza la exportación del proyecto a GitHub

title Valle de las Almas - GitHub Setup

echo 🌸 Configurando Valle de las Almas para GitHub...
echo.

:: 1. Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No estás en el directorio raíz de Valle de las Almas
    echo    Asegúrate de estar en la carpeta que contiene package.json y App.tsx
    pause
    exit /b 1
)

if not exist "App.tsx" (
    echo ❌ Error: No se encuentra App.tsx
    echo    Asegúrate de estar en el directorio correcto
    pause
    exit /b 1
)

echo ✅ Directorio del proyecto verificado
echo.

:: 2. Crear estructura de carpetas necesarias
echo ℹ️ Creando estructura de carpetas...
if not exist ".vscode" mkdir ".vscode"
if not exist ".github" mkdir ".github"
if not exist ".github\ISSUE_TEMPLATE" mkdir ".github\ISSUE_TEMPLATE"
if not exist ".github\workflows" mkdir ".github\workflows"

:: 3. Mover archivos de configuración a sus ubicaciones correctas
echo.
echo ℹ️ Organizando archivos de configuración...

if exist "extensions.json" (
    move "extensions.json" ".vscode\" >nul 2>&1
    echo ✅ extensions.json movido a .vscode/
)

if exist "settings.json" (
    move "settings.json" ".vscode\" >nul 2>&1
    echo ✅ settings.json movido a .vscode/
)

if exist "tasks.json" (
    move "tasks.json" ".vscode\" >nul 2>&1
    echo ✅ tasks.json movido a .vscode/
)

if exist "launch.json" (
    move "launch.json" ".vscode\" >nul 2>&1
    echo ✅ launch.json movido a .vscode/
)

:: 4. Verificar que Git esté instalado
echo.
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Git no está instalado
    echo    Descarga Git desde: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git está instalado

:: 5. Verificar que Node.js esté instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado
    echo    Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo ✅ Node.js !NODE_VERSION! detectado

:: 6. Instalar dependencias si no existen
if not exist "node_modules" (
    echo.
    echo ℹ️ Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
) else (
    echo ✅ Dependencias ya instaladas
)

:: 7. Probar que el build funciona
echo.
echo ℹ️ Verificando que el proyecto compile correctamente...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error: El proyecto no compila correctamente
    echo    Revisa los errores mostrados arriba
    pause
    exit /b 1
)
echo ✅ Proyecto compila correctamente

:: 8. Limpiar carpeta build
if exist "dist" rmdir /s /q "dist"
echo ℹ️ Limpieza de archivos de build completada

:: 9. Inicializar Git si no está inicializado
if not exist ".git" (
    echo.
    echo ℹ️ Inicializando repositorio Git...
    git init
    if %errorlevel% neq 0 (
        echo ❌ Error al inicializar Git
        pause
        exit /b 1
    )
    echo ✅ Repositorio Git inicializado
) else (
    echo ✅ Repositorio Git ya inicializado
)

:: 10. Solicitar información del usuario
echo.
echo 🔧 Configuración de GitHub
echo.

:: Verificar configuración de Git
for /f "tokens=*" %%a in ('git config --global user.name 2^>nul') do set GIT_USER=%%a
for /f "tokens=*" %%a in ('git config --global user.email 2^>nul') do set GIT_EMAIL=%%a

if "!GIT_USER!"=="" (
    echo 👤 Configura tu nombre para Git:
    set /p USER_NAME="Nombre completo: "
    git config --global user.name "!USER_NAME!"
    echo ✅ Nombre configurado: !USER_NAME!
) else (
    echo ✅ Nombre de Git ya configurado: !GIT_USER!
)

if "!GIT_EMAIL!"=="" (
    echo 📧 Configura tu email para Git:
    set /p USER_EMAIL="Email: "
    git config --global user.email "!USER_EMAIL!"
    echo ✅ Email configurado: !USER_EMAIL!
) else (
    echo ✅ Email de Git ya configurado: !GIT_EMAIL!
)

:: 11. Solicitar información del repositorio de GitHub
echo.
echo 🌟 Información del repositorio de GitHub:
echo.

set /p GITHUB_USER="📝 Tu nombre de usuario de GitHub: "
set /p REPO_NAME="🔗 Nombre del repositorio (valle-de-las-almas): "
if "!REPO_NAME!"=="" set REPO_NAME=valle-de-las-almas

:: 12. Agregar archivos a Git
echo.
echo ℹ️ Agregando archivos al repositorio...

git add .
if %errorlevel% neq 0 (
    echo ❌ Error al agregar archivos a Git
    pause
    exit /b 1
)
echo ✅ Archivos agregados a Git

:: 13. Crear commit inicial
echo.
echo ℹ️ Creando commit inicial...

git commit -m "🌸 Initial commit: Valle de las Almas v1.0.0

✨ Features:
- Complete memorial website with freemium business model
- 23 family relationship types with organized dropdown  
- Responsive design for all devices
- Complete development environment setup
- Ready for deployment on Vercel/Netlify

🛠️ Tech Stack:
- React 18 + TypeScript
- Tailwind CSS v4
- Vite + shadcn/ui
- Complete VS Code configuration

🚀 Ready for production deployment"

if %errorlevel% neq 0 (
    echo ❌ Error al crear commit
    pause
    exit /b 1
)
echo ✅ Commit inicial creado

:: 14. Configurar branch principal
git branch -M main
if %errorlevel% neq 0 (
    echo ❌ Error al configurar branch principal
    pause
    exit /b 1
)
echo ✅ Branch principal configurado como 'main'

:: 15. Agregar repositorio remoto
set REPO_URL=https://github.com/!GITHUB_USER!/!REPO_NAME!.git
git remote add origin "!REPO_URL!" 2>nul || git remote set-url origin "!REPO_URL!"
echo ✅ Repositorio remoto configurado: !REPO_URL!

:: 16. Mostrar instrucciones finales
echo.
echo 🎉 ¡Configuración completada exitosamente! 🎉
echo.
echo 📋 Próximos pasos:
echo.
echo 1. 🌟 Crear el repositorio en GitHub:
echo    - Ve a: https://github.com/new
echo    - Repository name: !REPO_NAME!
echo    - Description: 🌸 Memorial website with freemium business model
echo    - ☑️ Public
echo    - ☐ NO agregues README, .gitignore, o license (ya los tenemos)
echo    - Clic en 'Create repository'
echo.
echo 2. 🚀 Subir tu código a GitHub:
echo    git push -u origin main
echo.
echo 3. 🌐 Deploy automático:
echo    - Vercel: https://vercel.com/new
echo    - Netlify: https://app.netlify.com/start
echo.
echo 4. 🏷️ Configurar Topics en GitHub:
echo    memorial, tribute, react, typescript, tailwind, vite, family-tree
echo.
echo ⚠️ IMPORTANTE:
echo    - Asegúrate de crear el repositorio en GitHub ANTES de hacer push
echo    - Si tienes autenticación 2FA, necesitarás un Personal Access Token
echo.
echo 🔗 URLs importantes:
echo    📦 Repositorio: https://github.com/!GITHUB_USER!/!REPO_NAME!
echo    🌐 Demo (después del deploy): https://!REPO_NAME!.vercel.app
echo.
echo 💝 ¡Valle de las Almas listo para el mundo! 🌸
echo.

:: Abrir el navegador en GitHub
echo ¿Quieres abrir GitHub para crear el repositorio ahora? (s/n)
set /p OPEN_GITHUB=
if /i "!OPEN_GITHUB!"=="s" (
    start https://github.com/new
    echo 🌐 GitHub abierto en tu navegador
)

echo.
echo Presiona cualquier tecla para continuar...
pause >nul