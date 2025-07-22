#!/bin/bash

# 🌸 Valle de las Almas - Quick Start Script
# Este script configura el proyecto automáticamente

echo "🌸 Iniciando configuración de Valle de las Almas..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18.0.0 o superior."
    echo "🔗 Descarga desde: https://nodejs.org/"
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Se requiere Node.js $REQUIRED_VERSION o superior. Versión actual: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION - Compatible"
echo ""

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm."
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"
echo ""

echo "⚙️ Ejecutando configuración inicial..."
npm run setup

if [ $? -ne 0 ]; then
    echo "❌ Error en la configuración inicial"
    exit 1
fi

echo "✅ Configuración completada"
echo ""

echo "🎉 ¡Valle de las Almas está listo!"
echo ""
echo "📝 Comandos disponibles:"
echo "   npm run dev     - Iniciar servidor de desarrollo"
echo "   npm run build   - Construir para producción"
echo "   npm run preview - Vista previa de producción"
echo "   npm run lint    - Verificar código con ESLint"
echo ""
echo "🌐 Para iniciar el desarrollo, ejecuta:"
echo "   npm run dev"
echo ""
echo "📚 Consulta README.md para más información"
echo "💝 ¡Honrando la memoria de nuestros seres queridos! 🌸"