import path from 'path';
import HWPP from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: {
        app: path.resolve(__dirname, "./src/scripts/app.js"),
        auth: path.resolve(__dirname, "./src/scripts/auth.js"),
        dashboard: path.resolve(__dirname, "./src/scripts/dashboard.js")
    },
    output: {
        filename: "[name][contenthash].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
        assetModuleFilename: "[name][ext]",
    },
    plugins: [
        new HWPP({
            filename: "index.html",
            template: "./src/templates/index.html",
            chunks: ["app"]
        }),
        new HWPP({
            filename: "auth.html",
            template: "./src/templates/auth/auth.html",
            chunks: ["auth"]
        }),
        new HWPP({
            filename: "dashboard.html",
            template: "./src/templates/dashboard/dashboard.html",
            chunks: ["dashboard"]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.html/i,
                loader: "html-loader"
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
};
