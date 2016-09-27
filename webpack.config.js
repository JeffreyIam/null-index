var HtmlWebpackPlugin = require('html-webpack-plugin')
var htmlPlugin = new HtmlWebpackPlugin({
  inject: 'body',
  template: './client/index.html',
  filename: 'index.html'
})

module.exports = {
  entry: ['./client/index.js'],
  output: {
    path: './build-client',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
    ]
  },
  plugins: [htmlPlugin]
}
