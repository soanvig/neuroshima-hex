const {merge} = require('webpack-merge');
const common = require('./webpack.common.cjs');
const Dotenv = require("dotenv-webpack");

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    host: '0.0.0.0',
    port: 8081,
    historyApiFallback: true,
  },
  plugins: [
    new Dotenv({
      path: './.env.dev',
    }),
  ]
});
