import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            // react-datepicker 4.x has a "browser" field pointing to its UMD bundle, which Vite prefers and which
            // breaks the default import. Point it to the ES module build instead.
            { find: /^react-datepicker$/, replacement: 'react-datepicker/dist/es/index.js' },
        ],
    },
    server: {
        port: 3000,
    },
    build: {
        // Keep CRA's output directory so deploy.sh and .gitignore keep working
        outDir: 'build',
    },
})
