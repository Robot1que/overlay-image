const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: './app/ImageViewer.tsx',

    target: 'electron',

    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist/resources/app')
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }

};