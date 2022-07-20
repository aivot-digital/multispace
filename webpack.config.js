const path = require('path');

module.exports = {
    mode: 'production',
    entry: './bundle.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        library: 'MSP',
        libraryTarget: 'var',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'web/static/js')
    }
};