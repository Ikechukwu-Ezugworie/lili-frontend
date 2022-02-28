import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({

      // import.meta.env.VITE_PAYSTACK available here with: process.env.VITE_PAYSTACK;


  plugins: [vue()],
})
