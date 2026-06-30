import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['test-data/**', 'steps/**'],
    exports: {
        all: true,
        customExports(exports) {
            for (const e of Object.keys(exports)) exports[e] = exports[e].replace(/^\.\/dist\//, './')
            return exports
        },
    },
    unbundle: true,
    outDir: 'dist',
    format: 'esm',
    dts: true,
})
