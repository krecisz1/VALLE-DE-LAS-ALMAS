#!/usr/bin/env node

/**
 * Setup script for Valle de las Almas
 * Configures the project for development
 */

import { execSync } from 'child_process';
import fs, { existsSync, writeFileSync } from 'fs';
import path from 'path';

console.log('🌸 Configurando Valle de las Almas...\n');

// Check if .env exists, if not create from example
if (!existsSync('.env') && existsSync('.env.example')) {
  console.log('📄 Creando archivo .env desde .env.example...');
  const envExample = fs.readFileSync('.env.example', 'utf8');
  writeFileSync('.env', envExample);
  console.log('✅ Archivo .env creado\n');
}

// Check Node.js version
console.log('🔍 Verificando versión de Node.js...');
const nodeVersion = process.version;
const requiredVersion = '18.0.0';

if (nodeVersion < `v${requiredVersion}`) {
  console.error(`❌ Se requiere Node.js ${requiredVersion} o superior. Versión actual: ${nodeVersion}`);
  process.exit(1);
}
console.log(`✅ Node.js ${nodeVersion} - Compatible\n`);

// Install dependencies if node_modules doesn't exist
if (!existsSync('node_modules')) {
  console.log('📦 Instalando dependencias...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas correctamente\n');
  } catch (error) {
    console.error('❌ Error instalando dependencias:', error.message);
    process.exit(1);
  }
}

// Create public directory and manifest if they don't exist
if (!existsSync('public')) {
  console.log('📁 Creando directorio public...');
  execSync('mkdir -p public');
}

// Create site.webmanifest if it doesn't exist
if (!existsSync('public/site.webmanifest')) {
  console.log('📱 Creando web app manifest...');
  const manifest = {
    name: 'Valle de las Almas',
    short_name: 'Valle',
    description: 'Memorial website to honor the memory of loved ones',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#030213',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
  
  writeFileSync('public/site.webmanifest', JSON.stringify(manifest, null, 2));
  console.log('✅ Web app manifest creado\n');
}

console.log('🎉 ¡Valle de las Almas configurado correctamente!\n');
console.log('📝 Próximos pasos:');
console.log('   1. npm run dev     - Iniciar servidor de desarrollo');
console.log('   2. npm run build   - Construir para producción');
console.log('   3. npm run preview - Vista previa de producción\n');
console.log('🌐 El proyecto estará disponible en http://localhost:3000');
console.log('📚 Consulta README.md para más información\n');
console.log('💝 ¡Honrando la memoria de nuestros seres queridos! 🌸');