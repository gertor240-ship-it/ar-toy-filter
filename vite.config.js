import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    // Base URL для GitHub Pages
    // Измените на '/<repo-name>/' если деплоите на GitHub Pages
    base: '/ar-toy-filter/',

    // Build настройки
    build: {
        outDir: 'dist',
        assetsDir: 'assets',

        // Минимизация
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Убрать console.log в продакшн
            }
        },

        // Оптимизация chunk'ов
        rollupOptions: {
            output: {
                manualChunks: {
                    'aframe': ['aframe'],
                    'three': ['three']
                }
            }
        },

        // Source maps для отладки
        sourcemap: false,

        // Размер chunk'а warning
        chunkSizeWarningLimit: 1000
    },

    // Dev сервер настройки
    server: {
        port: 5173,
        https: false,
        host: true,
        cors: true,
        allowedHosts: true // ✅ Разрешить доступ с ngrok
    },

    // Asset обработка
    assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin'],

    // Оптимизация зависимостей
    optimizeDeps: {
        include: ['aframe', 'three']
    }
})
