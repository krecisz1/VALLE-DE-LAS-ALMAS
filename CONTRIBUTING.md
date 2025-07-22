# 🤝 Contribuir a Valle de las Almas

¡Gracias por tu interés en contribuir a Valle de las Almas! Este documento proporciona pautas para contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Envío de Pull Requests](#envío-de-pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Solicitar Características](#solicitar-características)

## 📜 Código de Conducta

Este proyecto se rige por nuestro [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que respetes este código.

## 🚀 Cómo Contribuir

Hay muchas formas de contribuir a Valle de las Almas:

- 🐛 **Reportar bugs**
- 💡 **Sugerir nuevas características**
- 📝 **Mejorar la documentación**
- 🔧 **Arreglar bugs existentes**
- ✨ **Implementar nuevas características**
- 🎨 **Mejorar el diseño y UX**
- 🧪 **Escribir y mejorar tests**

## 🛠️ Configuración del Entorno de Desarrollo

### Prerrequisitos

- **Node.js** 18.0.0 o superior
- **npm** 8.0.0 o superior
- **Git**

### Instalación

1. **Fork el repositorio**
   ```bash
   # Clic en "Fork" en GitHub
   ```

2. **Clonar tu fork**
   ```bash
   git clone https://github.com/tu-usuario/valle-de-las-almas.git
   cd valle-de-las-almas
   ```

3. **Configurar el repositorio upstream**
   ```bash
   git remote add upstream https://github.com/original-owner/valle-de-las-almas.git
   ```

4. **Instalar dependencias**
   ```bash
   npm install
   ```

5. **Configurar el entorno**
   ```bash
   npm run setup
   ```

6. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 🔄 Proceso de Desarrollo

### 1. Crear una Rama

```bash
# Asegúrate de estar en main y actualizado
git checkout main
git pull upstream main

# Crear nueva rama
git checkout -b feature/descripcion-de-la-feature
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Hacer Cambios

- Escribe código limpio y bien documentado
- Sigue los estándares de código del proyecto
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 3. Commit de Cambios

Usa commits descriptivos siguiendo la convención:

```bash
git add .
git commit -m "feat: agregar funcionalidad de comentarios anidados"
# o
git commit -m "fix: corregir error en validación de formularios"
# o
git commit -m "docs: actualizar guía de instalación"
```

**Tipos de commit:**
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

## 📏 Estándares de Código

### TypeScript/React

- Usa **TypeScript** para todo el código
- Sigue las convenciones de **React Hooks**
- Usa **interfaces** para definir tipos
- Evita **any**, usa tipos específicos

### Styling

- Usa **Tailwind CSS** para estilos
- Sigue la metodología **mobile-first**
- Usa las **variables CSS** definidas en globals.css
- Evita estilos inline cuando sea posible

### Naming Conventions

- **Componentes**: PascalCase (`MemorialCard.tsx`)
- **Funciones**: camelCase (`handleSubmit`)
- **Variables**: camelCase (`memorialData`)
- **Constantes**: SCREAMING_SNAKE_CASE (`MAX_PHOTOS`)
- **Archivos**: kebab-case para utilidades, PascalCase para componentes

### Estructura de Archivos

```
components/
├── ui/              # Componentes base (shadcn/ui)
├── forms/           # Componentes de formularios
├── layout/          # Componentes de layout
└── features/        # Componentes específicos de características
```

## 📤 Envío de Pull Requests

### Antes de Enviar

1. **Ejecutar tests**
   ```bash
   npm run lint
   npm run build
   ```

2. **Asegurarse de que todo funciona**
   ```bash
   npm run dev
   # Probar funcionalidad manualmente
   ```

3. **Actualizar desde upstream**
   ```bash
   git checkout main
   git pull upstream main
   git checkout tu-rama
   git rebase main
   ```

### Crear Pull Request

1. **Push de tu rama**
   ```bash
   git push origin tu-rama
   ```

2. **Crear PR en GitHub**
   - Título descriptivo
   - Descripción detallada de los cambios
   - Screenshots si hay cambios visuales
   - Listar breaking changes si los hay

### Template de PR

```markdown
## 📝 Descripción
Breve descripción de los cambios realizados.

## 🔗 Issue Relacionado
Fixes #(número del issue)

## 🧪 Tipo de Cambio
- [ ] 🐛 Bug fix
- [ ] ✨ Nueva característica
- [ ] 💥 Breaking change
- [ ] 📝 Documentación

## 🔍 Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas difíciles de entender
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Los tests nuevos y existentes pasan localmente

## 📷 Screenshots
(Si aplica, agregar screenshots de los cambios)
```

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Verificar si ya existe** el issue
2. **Reproducir el bug** en la última versión
3. **Comprobar** que no es un problema de configuración local

### Template de Bug Report

```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del bug.

## 🔄 Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Scroll hacia '...'
4. Ver error

## ✅ Comportamiento Esperado
Descripción de lo que esperabas que pasara.

## 📱 Información del Sistema
- OS: [e.g. macOS 14.0]
- Browser: [e.g. Chrome 118.0]
- Node.js: [e.g. 18.17.0]
- npm: [e.g. 9.6.7]

## 📷 Screenshots
Si aplica, agregar screenshots para explicar el problema.

## 📋 Contexto Adicional
Cualquier otra información relevante sobre el problema.
```

## 💡 Solicitar Características

### Template de Feature Request

```markdown
## 🚀 Resumen de la Característica
Descripción breve de la característica solicitada.

## 🎯 Motivación
¿Por qué es importante esta característica?

## 📝 Descripción Detallada
Descripción detallada de cómo debería funcionar.

## 🎨 Alternativas Consideradas
Describe cualquier solución alternativa que hayas considerado.

## 📋 Criterios de Aceptación
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3
```

## 🆘 ¿Necesitas Ayuda?

- 💬 **Discord**: [Únete a nuestro servidor](https://discord.gg/valle-almas)
- 📧 **Email**: contribuciones@valledealmas.com
- 📚 **Documentación**: [Wiki del proyecto](https://github.com/yourusername/valle-de-las-almas/wiki)

## 🙏 Reconocimientos

Todos los contribuidores serán reconocidos en el [README.md](README.md) y en nuestro sitio web.

---

<div align="center">
  <p><strong>¡Gracias por contribuir a Valle de las Almas! 🌸</strong></p>
  <p>Juntos hacemos posible honrar la memoria de nuestros seres queridos</p>
</div>