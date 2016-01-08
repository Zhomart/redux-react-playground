var webpack = require('webpack')

module.exports = {
    entry: "./app/main.js",
    output: {
        path: __dirname + "/public",
        publicPath: "/public/",
        filename: "bundle.js"
    },
    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
              test: /\.css$/,
              loaders: ["style", "raw"],
              include: __dirname
            },
            {
              test: /\.js?$/,
              exclude: /node_modules/,
              loader: 'babel',
              include: __dirname
            }
        ]
    }
};
