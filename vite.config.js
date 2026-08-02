import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/Ecommerce-Website/',   // agar GitHub Pages pe hai
  // ya
  base: '/',                      // agar Vercel/custom domain pe hai
})