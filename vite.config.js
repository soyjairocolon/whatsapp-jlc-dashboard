import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const pluginPath = "C:/Users/jairo/Local Sites/whatsapp-jlc-dev/app/public/wp-content/plugins/whatsapp-jlc/admin-panel/build";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: pluginPath,
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
})
