# 🚀 Guía Completa de Despliegue - Valle de las Almas

Esta guía te llevará paso a paso para exportar y desplegar tu aplicación web.

## 📋 Prerequisitos

- Node.js 18+ instalado
- Cuenta en GitHub
- Cuenta en Vercel, Netlify, o plataforma de hosting preferida

## 🔧 Paso 1: Preparación del Proyecto

### 1.1 Estructura de Archivos
Asegúrate de tener todos estos archivos en tu proyecto:

```
valle-de-las-almas/
├── App.tsx
├── main.tsx
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── netlify.toml
├── .env.example
├── README.md
├── components/
├── styles/
│   └── globals.css
└── public/
    ├── site.webmanifest
    ├── favicon.svg
    ├── favicon-32x32.png
    ├── favicon-16x16.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    └── og-image.jpg
```

### 1.2 Instalar Dependencias

```bash
# En la raíz del proyecto
npm install
```

### 1.3 Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus configuraciones específicas
```

## 🛠️ Paso 2: Build Local (Prueba)

### 2.1 Generar Build de Producción

```bash
# Compila TypeScript y genera archivos estáticos
npm run build
```

### 2.2 Previsualizar Build

```bash
# Ejecuta un servidor local con el build
npm run preview
```

La aplicación estará disponible en `http://localhost:4173`

## ☁️ Paso 3: Despliegue en Vercel (Recomendado)

### 3.1 Método Automático (GitHub)

1. **Sube tu código a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Valle de las Almas"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/valle-de-las-almas.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Haz clic en "New Project"
   - Selecciona tu repositorio
   - Configura:
     - **Framework Preset**: Vite
     - **Root Directory**: ./
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Configurar Variables de Entorno en Vercel:**
   - En el dashboard del proyecto → Settings → Environment Variables
   - Agrega las variables necesarias

4. **Deploy:**
   - Haz clic en "Deploy"
   - Vercel generará una URL: `https://tu-proyecto.vercel.app`

### 3.2 Método Manual (CLI)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

## 🌐 Paso 4: Despliegue en Netlify

### 4.1 Método Drag & Drop

1. **Generar Build:**
   ```bash
   npm run build
   ```

2. **Subir a Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `dist` al área de deploy
   - Netlify generará una URL automáticamente

### 4.2 Método Git (Automático)

1. **Conectar Repositorio:**
   - En Netlify → "New site from Git"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

2. **Variables de Entorno:**
   - Site settings → Environment variables
   - Agrega tus variables

## 🖥️ Paso 5: Despliegue en Servidor Propio

### 5.1 Build y Upload

```bash
# Generar archivos estáticos
npm run build

# Los archivos están en la carpeta 'dist'
# Sube todo el contenido de 'dist' a tu servidor web
```

### 5.2 Configuración del Servidor

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteRule ^(?!.*\.).*$ /index.html [L]

# Cache estático
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 year"
</FilesMatch>
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## 📊 Paso 6: Optimizaciones Post-Despliegue

### 6.1 Configurar Analytics

```typescript
// Añadir Google Analytics en index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 6.2 SEO y Performance

- ✅ Sitemap automático
- ✅ Meta tags optimizados
- ✅ Open Graph configurado
- ✅ PWA ready
- ✅ Assets optimizados

### 6.3 Monitoreo

- Configura alertas de uptime
- Monitorea performance con Lighthouse
- Configura error tracking (Sentry, etc.)

## 🔒 Paso 7: Dominio Personalizado

### 7.1 En Vercel

1. Project Settings → Domains
2. Agregar tu dominio
3. Configurar DNS según las instrucciones

### 7.2 En Netlify

1. Site settings → Domain management
2. Add custom domain
3. Configurar DNS records

## 🐛 Paso 8: Troubleshooting

### Errores Comunes

**Build falla:**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

**404 en rutas:**
- Verificar configuración SPA en `vercel.json` o `netlify.toml`

**Assets no cargan:**
- Revisar paths relativos vs absolutos
- Verificar configuración de build

### Logs y Debug

**Vercel:**
```bash
vercel logs tu-proyecto.vercel.app
```

**Build local con debug:**
```bash
npm run build -- --debug
```

## ✅ Checklist Final

- [ ] ✅ Build local exitoso
- [ ] ✅ Preview funciona correctamente
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Repository en GitHub
- [ ] ✅ Deploy exitoso en plataforma elegida
- [ ] ✅ URL personalizada (opcional)
- [ ] ✅ SSL/HTTPS habilitado
- [ ] ✅ Performance optimizada
- [ ] ✅ SEO configurado
- [ ] ✅ Analytics configurado (opcional)
- [ ] ✅ Monitoreo configurado

## 🎉 ¡Felicidades!

Tu aplicación **Valle de las Almas** ya está desplegada y lista para usar.

### URLs de Ejemplo:
- **Vercel**: `https://valle-de-las-almas.vercel.app`
- **Netlify**: `https://valle-de-las-almas.netlify.app`
- **Dominio propio**: `https://valledelasalmas.com`

### Próximos Pasos:
1. Comparte la URL con usuarios beta
2. Recopila feedback
3. Implementa analytics
4. Configura sistema de pagos (Stripe)
5. Añadir backend para persistencia de datos

---

**¿Necesitas ayuda?** 
- 📧 Email: soporte@valledelasalmas.com
- 📚 Documentación: [README.md](./README.md)