import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
    mode: 'development',
    devtool: "source-map",
    devServer: {
        watchFiles: [ "./src/templates/*.html", "./src/styles/*.css", ".src/scripts/*.js" ],
        static: {
            directory: path.resolve(__dirname, "dist")
        },
        open: {
            app: {
                name: 'C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe'
            }
        },
        port: 3000,
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
})
