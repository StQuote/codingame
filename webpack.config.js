const path = require('path');
const SRC = path.resolve(__dirname, 'src');
const COMPETE = path.resolve(SRC, 'compete');

module.exports = {
    entry: {
        'ghost-in-cell': path.resolve(COMPETE, 'ghost-in-cell/index.js'),
    },
    resolve: {
        alias: {
            utils: path.resolve(SRC, 'utils'),
        },
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    devtool: 'cheap-source-map',
};
