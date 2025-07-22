#!/bin/bash

# 🌸 Valle de las Almas - GitHub Export Script
# Este script automatiza la exportación del proyecto a GitHub

echo "🌸 Configurando Valle de las Almas para GitHub..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar errores
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Función para mostrar éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar advertencias
warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Función para mostrar información
info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -f "App.tsx" ]; then
    error_exit "No estás en el directorio raíz de Valle de las Almas"
fi

success "Directorio del proyecto verificado"

# 2. Crear estructura de carpetas necesarias
echo ""
info "Creando estructura de carpetas..."

mkdir -p .vscode
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p .github/workflows

# 3. Mover archivos de configuración a sus ubicaciones correctas
echo ""
info "Organizando archivos de configuración..."

# Mover archivos de VS Code si existen en la raíz
if [ -f "extensions.json" ]; then
    mv extensions.json .vscode/ 2>/dev/null || true
    success "extensions.json movido a .vscode/"
fi

if [ -f "settings.json" ]; then
    mv settings.json .vscode/ 2>/dev/null || true
    success "settings.json movido a .vscode/"
fi

if [ -f "tasks.json" ]; then
    mv tasks.json .vscode/ 2>/dev/null || true
    success "tasks.json movido a .vscode/"
fi

if [ -f "launch.json" ]; then
    mv launch.json .vscode/ 2>/dev/null || true
    success "launch.json movido a .vscode/"
fi

# 4. Verificar que Git esté instalado
if ! command -v git &> /dev/null; then
    error_exit "Git no está instalado. Por favor instala Git primero."
fi

success "Git está instalado"

# 5. Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    error_exit "Node.js no está instalado. Por favor instala Node.js 18+ primero."
fi

NODE_VERSION=$(node -v)
success "Node.js $NODE_VERSION detectado"

# 6. Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    info "Instalando dependencias..."
    npm install || error_exit "Error al instalar dependencias"
    success "Dependencias instaladas"
else
    success "Dependencias ya instaladas"
fi

# 7. Probar que el build funciona
echo ""
info "Verificando que el proyecto compile correctamente..."
npm run build || error_exit "El proyecto no compila correctamente. Revisa los errores."
success "Proyecto compila correctamente"

# 8. Limpiar carpeta build para no subirla a Git
rm -rf dist
info "Limpieza de archivos de build completada"

# 9. Inicializar Git si no está inicializado
if [ ! -d ".git" ]; then
    echo ""
    info "Inicializando repositorio Git..."
    git init || error_exit "Error al inicializar Git"
    success "Repositorio Git inicializado"
else
    success "Repositorio Git ya inicializado"
fi

# 10. Solicitar información del usuario
echo ""
echo -e "${BLUE}🔧 Configuración de GitHub${NC}"
echo ""

# Verificar configuración de Git
GIT_USER=$(git config --global user.name 2>/dev/null || echo "")
GIT_EMAIL=$(git config --global user.email 2>/dev/null || echo "")

if [ -z "$GIT_USER" ]; then
    echo "👤 Configura tu nombre para Git:"
    read -p "Nombre completo: " USER_NAME
    git config --global user.name "$USER_NAME"
    success "Nombre configurado: $USER_NAME"
else
    success "Nombre de Git ya configurado: $GIT_USER"
fi

if [ -z "$GIT_EMAIL" ]; then
    echo "📧 Configura tu email para Git:"
    read -p "Email: " USER_EMAIL
    git config --global user.email "$USER_EMAIL"
    success "Email configurado: $USER_EMAIL"
else
    success "Email de Git ya configurado: $GIT_EMAIL"
fi

# 11. Solicitar información del repositorio de GitHub
echo ""
echo "🌟 Información del repositorio de GitHub:"
echo ""

read -p "📝 Tu nombre de usuario de GitHub: " GITHUB_USER
read -p "🔗 Nombre del repositorio (valle-de-las-almas): " REPO_NAME
REPO_NAME=${REPO_NAME:-valle-de-las-almas}

# 12. Agregar archivos a Git
echo ""
info "Agregando archivos al repositorio..."

# Verificar que .gitignore existe
if [ ! -f ".gitignore" ]; then
    warning "No se encontró .gitignore. Creando uno básico..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
dist/
.env
.env.local

# Editor
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json

# OS
.DS_Store
Thumbs.db
EOL
fi

git add . || error_exit "Error al agregar archivos a Git"
success "Archivos agregados a Git"

# 13. Crear commit inicial
echo ""
info "Creando commit inicial..."

COMMIT_MESSAGE="🌸 Initial commit: Valle de las Almas v1.0.0

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

git commit -m "$COMMIT_MESSAGE" || error_exit "Error al crear commit"
success "Commit inicial creado"

# 14. Configurar branch principal
git branch -M main || error_exit "Error al renombrar branch a main"
success "Branch principal configurado como 'main'"

# 15. Agregar repositorio remoto
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
success "Repositorio remoto configurado: $REPO_URL"

# 16. Mostrar instrucciones finales
echo ""
echo -e "${GREEN}🎉 ¡Configuración completada exitosamente! 🎉${NC}"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo ""
echo "1. 🌟 Crear el repositorio en GitHub:"
echo "   - Ve a: https://github.com/new"
echo "   - Repository name: $REPO_NAME"
echo "   - Description: 🌸 Memorial website with freemium business model"
echo "   - ☑️ Public"
echo "   - ☐ NO agregues README, .gitignore, o license (ya los tenemos)"
echo "   - Clic en 'Create repository'"
echo ""
echo "2. 🚀 Subir tu código a GitHub:"
echo "   git push -u origin main"
echo ""
echo "3. 🌐 Deploy automático:"
echo "   - Vercel: https://vercel.com/new"
echo "   - Netlify: https://app.netlify.com/start"
echo ""
echo "4. 🏷️ Configurar Topics en GitHub:"
echo "   memorial, tribute, react, typescript, tailwind, vite, family-tree"
echo ""
echo -e "${YELLOW}⚠️ IMPORTANTE:${NC}"
echo "   - Asegúrate de crear el repositorio en GitHub ANTES de hacer push"
echo "   - Si tienes autenticación 2FA, necesitarás un Personal Access Token"
echo ""
echo -e "${GREEN}🔗 URLs importantes:${NC}"
echo "   📦 Repositorio: https://github.com/$GITHUB_USER/$REPO_NAME"
echo "   🌐 Demo (después del deploy): https://$REPO_NAME.vercel.app"
echo ""
echo -e "${BLUE}💝 ¡Valle de las Almas listo para el mundo! 🌸${NC}"