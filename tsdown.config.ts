import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['test-data/**', 'steps/**'],
    unbundle: true,
    outDir: 'dist',
    format: 'esm',
    dts: true,
})
