const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        watchFiles: [
            "./src/templates/*/*.html",
            "./src/templates/*/*.js",
            "./src/styles/*.css",
            "./src/scripts/*.js"
        ],
        static: {
            directory: path.resolve(__dirname, "dist")
        },
        open: {
            app: {
                name: 'C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe'
            }
        },
        historyApiFallback: {
            rewrites: [
                { from: /^\/$/, to: 'index.html' },
                { from: /^\/auth/, to: 'auth.html' },
                { from: /./, to: '404.html' },
            ]
        },
        port: 3000,
        hot: true,
        compress: true,
    },
})
