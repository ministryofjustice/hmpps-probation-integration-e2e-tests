export default {
    formatOptions: {
        snippetInterface: 'async-await',
    },
    paths: ['features/**/*.feature'],
    dryRun: false,
    import: [
        'var/cucumber-init.ts',
        'features/*/common/*.ts',
        'features/*/steps/*.ts', // this isn't right!
    ],
    importModule: ['ts-node/register'],
    format: ['progress-bar'],
    parallel: 1,
}
