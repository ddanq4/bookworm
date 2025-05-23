module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['next/babel'],
        ['@babel/preset-react', { runtime: 'automatic' }] // 👈 это фикс
    ],
    plugins: [['module-resolver', { alias: { '@': './src' } }]]
};
