const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'Skyboxes - Scum.Systems',
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  }
};