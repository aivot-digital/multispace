var path = require('path');

module.exports = {
    mode: 'production',
    entry: './bundle.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'web/static/js')
    }
};