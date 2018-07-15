module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true
    },
    extends: 'standard',
    // required to lint *.vue files
    plugins: [
        'vuefix',
        'html'
    ],
    // add your custom rules here
    rules: {
        "vuefix/vuefix": [2, {
            "auto": true
        }]
    },
    globals: {}
}