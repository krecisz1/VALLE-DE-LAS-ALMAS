# 📥 Guía de Exportación desde Figma Make

Esta guía te explica cómo exportar todo el proyecto "Valle de las Almas" desde Figma Make a tu escritorio.

## 🔄 Método 1: Exportación Automática (Recomendado)

### Paso 1: Usar el Botón de Exportación
1. **En Figma Make**, busca el botón **"Export"** o **"Download"** 
   - Usualmente está en la esquina superior derecha
   - Puede aparecer como un ícono de descarga ⬇️ o como texto "Export"

2. **Seleccionar formato:**
   - Elige **"Full Project"** o **"Complete Code"**
   - Formato: **ZIP file**

3. **Descargar:**
   - Haz clic en **"Download"** o **"Export"**
   - El archivo se descargará como `valle-de-las-almas.zip`

### Paso 2: Extraer en tu Escritorio
1. **Localizar el archivo:**
   - Ve a tu carpeta de **Descargas**
   - Busca `valle-de-las-almas.zip`

2. **Extraer:**
   ```bash
   # En Windows: Clic derecho > "Extraer aquí"
   # En Mac: Doble clic en el archivo ZIP
   # En Linux: unzip valle-de-las-almas.zip
   ```

3. **Mover al Escritorio:**
   - Corta/copia la carpeta extraída
   - Pégala en tu **Escritorio**

## 🛠️ Método 2: Exportación Manual (Alternativo)

Si no encuentras el botón de exportación, puedes copiar archivos manualmente:

### Paso 1: Crear Estructura de Carpetas
```bash
# Crear en tu Escritorio:
valle-de-las-almas/
├── components/
│   ├── ui/
│   └── figma/
├── styles/
├── public/
└── (archivos raíz)
```

### Paso 2: Copiar Archivos Principales
Copia cada archivo del proyecto creando nuevos archivos con el mismo nombre:

**Archivos Raíz:**
- `App.tsx`
- `main.tsx` 
- `index.html`
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.node.json`
- `vercel.json`
- `netlify.toml`
- `.env.example`
- `README.md`
- `DEPLOYMENT_GUIDE.md`

**Carpeta components/:**
- Todos los archivos `.tsx` de componentes
- Subcarpeta `ui/` con todos los componentes ShadCN
- Subcarpeta `figma/` con `ImageWithFallback.tsx`

**Carpeta styles/:**
- `globals.css`

**Carpeta public/:**
- `site.webmanifest`
- Archivos de favicon (cuando los agregues)

## 🚀 Método 3: Clone desde GitHub (Si está sincronizado)

Si Figma Make está conectado a GitHub:

```bash
# Abrir terminal en tu Escritorio
cd ~/Desktop

# Clonar el repositorio
git clone https://github.com/tu-usuario/valle-de-las-almas.git

# Entrar al proyecto
cd valle-de-las-almas
```

## ✅ Verificar la Exportación

### Paso 1: Revisar Estructura
Tu carpeta debe verse así:
```
valle-de-las-almas/
├── App.tsx                    ✅
├── main.tsx                   ✅  
├── index.html                 ✅
├── package.json               ✅
├── vite.config.ts            ✅
├── components/               ✅
│   ├── Dashboard.tsx         ✅
│   ├── LoginScreen.tsx       ✅
│   ├── MemorialProfile.tsx   ✅
│   ├── PricingModal.tsx      ✅
│   ├── ui/                   ✅
│   └── (otros componentes)   ✅
├── styles/
│   └── globals.css           ✅
└── public/
    └── site.webmanifest      ✅
```

### Paso 2: Probar Funcionamiento
```bash
# Abrir terminal en la carpeta del proyecto
cd valle-de-las-almas

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Si todo funciona, verás:
```
✅ Local:   http://localhost:5173/
✅ Network: http://192.168.x.x:5173/
```

## 🔧 Solucionar Problemas Comunes

### Error: "npm no encontrado"
```bash
# Instalar Node.js desde: https://nodejs.org
# Reiniciar terminal después de instalar
```

### Error: "Dependencias faltantes"
```bash
# Verificar que package.json existe
# Ejecutar: npm install --force
```

### Error: "Puerto ocupado"
```bash
# Cambiar puerto: npm run dev -- --port 3000
```

### Archivos faltantes
- Revisa que todos los archivos se copiaron correctamente
- Verifica que las rutas de importación sean correctas
- Asegúrate de que `components/ui/` tenga todos los archivos

## 📋 Checklist Final

- [ ] ✅ Carpeta creada en el Escritorio
- [ ] ✅ Todos los archivos principales copiados
- [ ] ✅ Estructura de carpetas correcta
- [ ] ✅ `npm install` ejecutado sin errores
- [ ] ✅ `npm run dev` funciona correctamente
- [ ] ✅ Aplicación carga en `http://localhost:5173`
- [ ] ✅ Todas las funcionalidades funcionan

## 🎯 Próximos Pasos

Una vez exportado exitosamente:

1. **Configurar Git:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Valle de las Almas"
   ```

2. **Crear repositorio en GitHub:**
   - Ve a github.com
   - Crear nuevo repositorio
   - Seguir instrucciones de conexión

3. **Desplegar:**
   - Seguir `DEPLOYMENT_GUIDE.md`
   - Usar Vercel, Netlify, o tu plataforma preferida

## 🆘 Ayuda Adicional

### Ubicaciones Comunes de Descarga:
- **Windows**: `C:\Users\TuNombre\Downloads\`
- **Mac**: `/Users/TuNombre/Downloads/`
- **Linux**: `/home/tu-nombre/Downloads/`

### Editores Recomendados:
- **Visual Studio Code** (Gratuito, recomendado)
- **WebStorm** (De pago, muy completo)
- **Sublime Text** (Ligero y rápido)

### Extensiones Útiles para VS Code:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter

---

¡Listo! Tu proyecto **Valle de las Almas** ya está en tu escritorio y listo para desarrollo local. 🚀