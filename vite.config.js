import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'https://echo.free.beeceptor.com',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
})