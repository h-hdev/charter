const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');


module.exports = {
    entry: './src/index.js',
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                "babel-loader"
               //  "eslint-loader"
            ]
        }, {
            test: /\.html$/,
            use: [{
                loader: "html-loader",
                options: { minimize: false }
            }]
        }]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            minify: false
        }),
        // new MiniCssExtractPlugin({
        //     filename: "[name].css",
        //     chunkFilename: "[id].css"
        // }),
        // extractSass,
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        host: '0.0.0.0',
        contentBase: 'public',
        port: 8090,
        compress: true,
        hot: true
    }
};