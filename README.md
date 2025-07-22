# 🌸 Valle de las Almas

![Valle de las Almas](https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=300&fit=crop)

**Valle de las Almas** es una plataforma digital hermosa y emotiva para crear memoriales en línea y honrar la memoria de nuestros seres queridos. Con un modelo de negocio freemium, ofrece tanto planes gratuitos como premium para satisfacer diferentes necesidades.

## ✨ Características Principales

### 🆓 Plan Gratuito
- **1 memorial básico** con información personal completa
- **Foto principal** de perfil
- **Biografía ilimitada** para contar su historia
- **Visualización pública** para compartir recuerdos
- **Comentarios básicos** (hasta 5 por memorial)

### 👑 Plan Tributo Completo ($4.99/mes)
- **Memoriales ilimitados** para toda la familia
- **Galería de fotos completa** con títulos personalizados
- **Videos y multimedia** para preservar momentos especiales
- **Árbol genealógico interactivo** con relaciones familiares
- **Códigos QR para lápidas** acceso rápido desde cementerios
- **Comentarios ilimitados** de familiares y amigos
- **Búsqueda avanzada** y filtros
- **Configuración de privacidad** granular
- **Soporte prioritario**

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Build Tool**: Vite
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Forms**: React Hook Form
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Deployment**: Vercel / Netlify

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18.0.0 o superior
- npm 8.0.0 o superior

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/yourusername/valle-de-las-almas.git
   cd valle-de-las-almas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

4. **Ejecutar configuración inicial**
   ```bash
   npm run setup
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo
npm start           # Alias para npm run dev

# Construcción
npm run build       # Construye la aplicación para producción
npm run preview     # Vista previa de la build de producción

# Calidad de código
npm run lint        # Ejecuta ESLint para verificar el código

# Configuración
npm run setup       # Ejecuta la configuración inicial del proyecto
```

## 🏗️ Estructura del Proyecto

```
valle-de-las-almas/
├── components/              # Componentes React reutilizables
│   ├── ui/                 # Componentes UI base (shadcn/ui)
│   ├── figma/              # Componentes específicos de Figma
│   ├── Dashboard.tsx       # Panel principal de usuario
│   ├── MemorialProfile.tsx # Perfil de memorial
│   ├── LoginScreen.tsx     # Pantalla de inicio de sesión
│   └── ...                 # Otros componentes
├── styles/                 # Archivos de estilos
│   └── globals.css         # Estilos globales con Tailwind v4
├── public/                 # Archivos estáticos
├── App.tsx                 # Componente principal de la aplicación
├── main.tsx               # Punto de entrada de React
├── index.html             # Template HTML base
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json          # Configuración de TypeScript
├── package.json           # Dependencias y scripts
└── README.md              # Este archivo
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. **Conectar con Vercel**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Hacer deploy
   vercel
   ```

2. **Configuración automática**
   - Vercel detecta automáticamente la configuración de Vite
   - Variables de entorno se configuran en el dashboard de Vercel

### Netlify

1. **Deploy directo desde GitHub**
   - Conecta tu repositorio en netlify.com
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **O usar Netlify CLI**
   ```bash
   # Instalar Netlify CLI
   npm install -g netlify-cli
   
   # Hacer deploy
   netlify deploy --prod --dir=dist
   ```

## 🎨 Personalización

### Colores y Temas
Los colores se definen en `styles/globals.css` usando variables CSS con soporte para modo oscuro.

### Componentes UI
Los componentes base están en `components/ui/` y siguen los patrones de shadcn/ui.

### Planes de Suscripción
Modifica `SUBSCRIPTION_PLANS` en `App.tsx` para ajustar características y precios.

## 📱 Características Responsivas

La aplicación está optimizada para:
- 📱 **Mobile**: Diseño móvil first
- 📱 **Tablet**: Interfaces adaptadas para tablets
- 💻 **Desktop**: Experiencia completa de escritorio
- 🖥️ **Large screens**: Soporte para pantallas grandes

## 🔒 Privacidad y Seguridad

- **Datos locales**: Todos los datos se almacenan localmente en el frontend
- **Sin backend**: No hay servidor que almacene información personal
- **Privacidad por diseño**: Control granular de privacidad para cada memorial
- **Acceso QR**: Sistema seguro de acceso mediante códigos QR

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

- **Email**: soporte@valledealmas.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/valle-de-las-almas/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/yourusername/valle-de-las-almas/wiki)

## 🙏 Agradecimientos

- **Iconos**: [Lucide Icons](https://lucide.dev/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Imágenes**: [Unsplash](https://unsplash.com/)

---

<div align="center">
  <p><strong>Honrando la memoria de nuestros seres queridos 🌸</strong></p>
  <p>Hecho con ❤️ por el equipo de Valle de las Almas</p>
</div>