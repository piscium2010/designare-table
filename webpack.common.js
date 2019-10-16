const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: './src/app.jsx'
    },
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|woff2|woff|eot|svg|ttf)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Lime',
            filename: 'index.html',
            template: './index.html'
        })
    ]
}
