const path = require("path");
const HWPP = require("html-webpack-plugin");

module.exports = {
    entry: {
        app: path.resolve(__dirname, "./src/app.js"),
        auth: path.resolve(__dirname, "./src/templates/auth/auth.js"),
        notfound: path.resolve(__dirname, "./src/templates/404/404.js"),
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
            template: "./src/index.html",
            chunks: ["app"]
        }),
        new HWPP({
            filename: "auth.html",
            template: "./src/templates/auth/auth.html",
            chunks: ["auth"]
        }),
        new HWPP({
            filename: "404.html",
            template: "./src/templates/404/404.html",
            chunks: ["notfound"]
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
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
