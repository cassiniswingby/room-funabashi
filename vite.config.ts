import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react-datepicker',
      '@floating-ui/dom',
      '@popperjs/core'
    ]
  },
  ssr: {
    noExternal: [
      'react-datepicker',
      '@floating-ui/dom',
      '@popperjs/core'
    ]
  }
});