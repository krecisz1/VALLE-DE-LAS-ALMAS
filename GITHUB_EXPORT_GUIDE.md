# 🚀 Guía Completa: Exportar Valle de las Almas a GitHub

Esta guía te llevará paso a paso para crear un repositorio profesional de GitHub con "Valle de las Almas".

## 📋 Índice
1. [Preparación del Proyecto](#preparación-del-proyecto)
2. [Crear Repositorio en GitHub](#crear-repositorio-en-github)
3. [Configurar Git Local](#configurar-git-local)
4. [Primer Push a GitHub](#primer-push-a-github)
5. [Configurar Repositorio Profesional](#configurar-repositorio-profesional)
6. [Configurar GitHub Pages (Opcional)](#configurar-github-pages)
7. [Integración con Servicios](#integración-con-servicios)
8. [Colaboración y Maintenance](#colaboración-y-maintenance)

---

## 🛠️ Preparación del Proyecto

### 1. Verificar Estructura de Archivos

Antes de subir a GitHub, necesitas mover algunos archivos a sus ubicaciones correctas:

```bash
# Crear carpeta .vscode si no existe
mkdir -p .vscode

# Mover archivos de configuración de VS Code
mv extensions.json .vscode/
mv settings.json .vscode/
mv tasks.json .vscode/
mv launch.json .vscode/
```

### 2. Verificar que el Proyecto Funciona

```bash
# Instalar dependencias
npm install

# Configurar el proyecto
npm run setup

# Probar que funciona
npm run dev
```

✅ **Verificar que el proyecto se ejecute en http://localhost:3000**

---

## 🌟 Crear Repositorio en GitHub

### Paso 1: Ir a GitHub
1. **Visita**: https://github.com
2. **Inicia sesión** en tu cuenta
3. **Clic en el botón verde "New"** (parte superior izquierda)

### Paso 2: Configurar el Repositorio
```
Repository name: valle-de-las-almas
Description: 🌸 Memorial website with freemium business model - A beautiful platform to honor the memory of loved ones

☑️ Public (recomendado para portfolios)
☐ Add a README file (ya tenemos uno)
☐ Add .gitignore (ya tenemos uno)
☐ Choose a license (ya tenemos LICENSE)
```

### Paso 3: Crear el Repositorio
**Clic en "Create repository"**

---

## 💻 Configurar Git Local

### 1. Abrir Terminal en tu Proyecto

```bash
# Navegar a la carpeta del proyecto
cd valle-de-las-almas
```

### 2. Inicializar Git

```bash
# Inicializar repositorio Git
git init

# Configurar tu información (si no lo has hecho antes)
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### 3. Agregar Archivos

```bash
# Agregar todos los archivos
git add .

# Verificar qué archivos se van a subir
git status
```

### 4. Primer Commit

```bash
# Crear el commit inicial
git commit -m "🌸 Initial commit: Valle de las Almas v1.0.0

✨ Features:
- Complete memorial website with freemium model
- 23 family relationship types with organized dropdown
- Responsive design for all devices
- Complete development environment setup
- Ready for deployment on Vercel/Netlify

🛠️ Tech Stack:
- React 18 + TypeScript
- Tailwind CSS v4
- Vite + shadcn/ui
- Complete VS Code configuration"
```

### 5. Conectar con GitHub

```bash
# Agregar el repositorio remoto (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/valle-de-las-almas.git

# Cambiar a branch main
git branch -M main

# Subir al repositorio
git push -u origin main
```

---

## 🎯 Primer Push a GitHub

### Comando Completo:

```bash
# Todo en una sola secuencia
git init
git add .
git commit -m "🌸 Initial commit: Valle de las Almas v1.0.0"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/valle-de-las-almas.git
git push -u origin main
```

### Si hay Problemas de Autenticación:

#### Opción 1: HTTPS con Token
```bash
# Generar Personal Access Token en GitHub
# Settings → Developer settings → Personal access tokens → Generate new token

# Usar el token como contraseña cuando Git lo pida
```

#### Opción 2: SSH (Recomendado)
```bash
# Generar clave SSH
ssh-keygen -t rsa -b 4096 -C "tu-email@ejemplo.com"

# Agregar clave SSH a GitHub
# Settings → SSH and GPG keys → New SSH key

# Cambiar URL del repositorio a SSH
git remote set-url origin git@github.com:TU-USUARIO/valle-de-las-almas.git
```

---

## 🏆 Configurar Repositorio Profesional

### 1. Actualizar README.md

El README.md ya está perfectamente configurado, pero puedes personalizarlo:

```bash
# Editar README.md para actualizar:
# - URL del repositorio
# - URL del demo (una vez deployado)
# - Tu información de contacto
```

### 2. Configurar Topics en GitHub

En tu repositorio de GitHub:
1. **Ir a la página principal del repo**
2. **Clic en ⚙️ (Settings)**
3. **En "Topics"** agregar:
   ```
   memorial, tribute, react, typescript, tailwind, vite, family-tree, freemium, spanish, memorial-website
   ```

### 3. Configurar Issues Templates

Crear carpeta `.github`:

```bash
mkdir -p .github/ISSUE_TEMPLATE
```

### 4. Configurar Branch Protection

En GitHub:
1. **Settings → Branches**
2. **Add rule**
3. **Branch name pattern**: `main`
4. **☑️ Require status checks to pass**
5. **☑️ Require branches to be up to date**

### 5. Agregar Shields/Badges

Editar README.md para agregar badges al inicio:

```markdown
# 🌸 Valle de las Almas

[![GitHub Stars](https://img.shields.io/github/stars/TU-USUARIO/valle-de-las-almas?style=for-the-badge)](https://github.com/TU-USUARIO/valle-de-las-almas/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/TU-USUARIO/valle-de-las-almas?style=for-the-badge)](https://github.com/TU-USUARIO/valle-de-las-almas/network)
[![GitHub Issues](https://img.shields.io/github/issues/TU-USUARIO/valle-de-las-almas?style=for-the-badge)](https://github.com/TU-USUARIO/valle-de-las-almas/issues)
[![License](https://img.shields.io/github/license/TU-USUARIO/valle-de-las-almas?style=for-the-badge)](https://github.com/TU-USUARIO/valle-de-las-almas/blob/main/LICENSE)
```

---

## 🌐 Configurar GitHub Pages (Opcional)

### Para Demo en Vivo:

```bash
# 1. Build del proyecto
npm run build

# 2. Instalar gh-pages
npm install --save-dev gh-pages

# 3. Agregar script en package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# 4. Deploy
npm run deploy
```

### Configurar en GitHub:
1. **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: gh-pages
4. **Folder**: / (root)

---

## ⚡ Integración con Servicios

### 1. Deploy Automático en Vercel

#### Método 1: Botón de Deploy
Agregar al README.md:
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU-USUARIO/valle-de-las-almas)
```

#### Método 2: Conectar Manualmente
1. **Ir a vercel.com**
2. **Import Git Repository**
3. **Seleccionar tu repo**
4. **Deploy automático**

### 2. Deploy Automático en Netlify

```markdown
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/TU-USUARIO/valle-de-las-almas)
```

### 3. Configurar CI/CD con GitHub Actions

Crear `.github/workflows/ci.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Build project
      run: npm run build
```

---

## 👥 Colaboración y Maintenance

### 1. Configurar Pull Request Template

Crear `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## 📝 Descripción
Breve descripción de los cambios realizados.

## 🔗 Issue Relacionado
Fixes #(número del issue)

## ✅ Checklist
- [ ] He probado mi código localmente
- [ ] Los tests pasan
- [ ] He actualizado la documentación
- [ ] Sigue las convenciones del proyecto
```

### 2. Configurar Semantic Versioning

```bash
# Instalar standard-version
npm install --save-dev standard-version

# Agregar scripts
"scripts": {
  "release": "standard-version"
}
```

### 3. Configurar Dependabot

Crear `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## 🎉 Verificación Final

### Checklist de Repositorio Profesional:

- [ ] ✅ **Código subido correctamente**
- [ ] ✅ **README.md completo y atractivo**
- [ ] ✅ **LICENSE incluido**
- [ ] ✅ **CONTRIBUTING.md presente**
- [ ] ✅ **Issues templates configurados**
- [ ] ✅ **Topics/tags configurados**
- [ ] ✅ **Deploy buttons agregados**
- [ ] ✅ **CI/CD configurado**
- [ ] ✅ **Branch protection activado**
- [ ] ✅ **Badges en README.md**

### URLs Importantes:

Una vez configurado, tendrás:

- **🔗 Repositorio**: `https://github.com/TU-USUARIO/valle-de-las-almas`
- **🌐 Demo Vercel**: `https://valle-de-las-almas.vercel.app`
- **📖 GitHub Pages**: `https://TU-USUARIO.github.io/valle-de-las-almas`

---

## 🆘 Solución de Problemas Comunes

### Error: "Repository already exists"
```bash
# Si el repositorio ya existe, clónalo y añade tus archivos
git clone https://github.com/TU-USUARIO/valle-de-las-almas.git
cd valle-de-las-almas
# Copiar todos tus archivos del proyecto aquí
git add .
git commit -m "Add Valle de las Almas project"
git push
```

### Error: "Permission denied"
```bash
# Configurar autenticación SSH o usar token personal
# Ver sección de autenticación arriba
```

### Archivos grandes
```bash
# Si tienes archivos muy grandes, usar Git LFS
git lfs install
git lfs track "*.png"
git lfs track "*.jpg"
git add .gitattributes
```

---

## 🚀 Próximos Pasos Recomendados

1. **🌟 Crear un demo en vivo** (Vercel/Netlify)
2. **📢 Compartir en redes sociales** con screenshots
3. **💼 Agregarlo a tu portfolio**
4. **🤝 Invitar colaboradores** si es necesario
5. **📈 Configurar analytics** (GitHub Insights)
6. **🏷️ Crear releases** con semantic versioning
7. **📝 Escribir blog post** sobre el proyecto

---

<div align="center">
  <p><strong>🎉 ¡Felicitaciones! Tu repositorio está listo 🎉</strong></p>
  <p><strong>Valle de las Almas ya está en GitHub como un proyecto profesional 🌸</strong></p>
</div>