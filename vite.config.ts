import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/components': resolve(__dirname, './components'),
      '@/styles': resolve(__dirname, './styles'),
      // ⚠️ Esto normalmente no se necesita:
      // '@/public': resolve(__dirname, './public')
      // Si quieres acceder a archivos de `public`, usa rutas absolutas: /imagen.png
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'qrcode']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-popover']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true // permite acceso desde red local
  },
  preview: {
    port: 4173,
    open: true
  }
})
