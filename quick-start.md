# 🚀 Guía de Inicio Rápido - Valle de las Almas

Esta guía te ayudará a configurar y ejecutar **Valle de las Almas** en tu entorno local en menos de 5 minutos.

## ⚡ Instalación Rápida

### 1. Prerrequisitos
Asegúrate de tener instalado:
- **Node.js 18+** ([Descargar aquí](https://nodejs.org/))
- **npm 8+** (viene incluido con Node.js)

### 2. Clonar e Instalar
```bash
# Clonar el repositorio
git clone https://github.com/yourusername/valle-de-las-almas.git
cd valle-de-las-almas

# Instalar dependencias y configurar
npm install
npm run setup

# Iniciar el servidor de desarrollo
npm run dev
```

### 3. ¡Listo! 🎉
Abre tu navegador en: **http://localhost:3000**

## 🎯 Características Principales

### Plan Gratuito
- ✅ 1 memorial básico
- ✅ Foto principal
- ✅ Biografía completa
- ✅ 5 comentarios

### Plan Tributo Completo ($4.99/mes)
- ✅ Memoriales ilimitados
- ✅ Galería de fotos
- ✅ Videos y multimedia
- ✅ Árbol genealógico
- ✅ Códigos QR
- ✅ Comentarios ilimitados

## 🛠️ Comandos Útiles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm run preview  # Vista previa de producción
npm run lint     # Verificar código
```

## 📱 Cuentas de Prueba

### Usuario Demo
- **Email**: demo@valledealmas.com
- **Contraseña**: demo123
- **Plan**: Tributo Completo (para probar todas las características)

### Usuario Gratuito
- **Email**: free@valledealmas.com
- **Contraseña**: free123
- **Plan**: Gratuito (para probar limitaciones)

## 🔧 Configuración Opcional

### Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar valores según necesites
nano .env
```

### Personalizar Colores
Edita `styles/globals.css` para cambiar la paleta de colores.

### Modificar Planes
Actualiza `SUBSCRIPTION_PLANS` en `App.tsx` para ajustar precios y características.

## 🚀 Despliegue Rápido

### Vercel (1-Click Deploy)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/valle-de-las-almas)

### Netlify (1-Click Deploy)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/valle-de-las-almas)

## 📞 ¿Necesitas Ayuda?

- 📖 **Documentación completa**: [README.md](./README.md)
- 🐛 **Reportar problemas**: [GitHub Issues](https://github.com/yourusername/valle-de-las-almas/issues)
- 💬 **Soporte**: soporte@valledealmas.com

## 📁 Estructura Básica

```
valle-de-las-almas/
├── components/          # Componentes React
│   ├── Dashboard.tsx    # Panel principal
│   ├── MemorialProfile.tsx # Perfil de memorial
│   └── ui/             # Componentes UI base
├── styles/
│   └── globals.css     # Estilos Tailwind v4
├── App.tsx             # App principal
├── main.tsx           # Punto de entrada
└── package.json       # Configuración del proyecto
```

---

<div align="center">
  <p><strong>🌸 ¡Bienvenido a Valle de las Almas! 🌸</strong></p>
  <p>Honrando la memoria de nuestros seres queridos</p>
</div>