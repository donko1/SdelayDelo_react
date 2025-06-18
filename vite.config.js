import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { 
        find: '@', 
        replacement: path.resolve(__dirname, 'src') 
      },
      { 
        find: '@pages', 
        replacement: path.resolve(__dirname, 'src/pages') 
      },
      { 
        find: '@components', 
        replacement: path.resolve(__dirname, 'src/components') 
      },
      { 
        find: '@utils', 
        replacement: path.resolve(__dirname, 'src/utils') 
      },
      { 
        find: '@context', 
        replacement: path.resolve(__dirname, 'src/context') 
      },
      { 
        find: '@assets', 
        replacement: path.resolve(__dirname, 'src/assets') 
      }
    ]
  }
})