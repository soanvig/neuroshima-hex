const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.client.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(svelte)$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            preprocess: require('svelte-preprocess')({}),
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {loader: 'css-loader', options: {sourceMap: true}},
        ],
      },

      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve('buffer'),
      stream: require.resolve('stream-browserify'),
      process: require.resolve('process/browser'),
    },
    extensions: ['.ts', '.js', '.svelte'],
    alias: {
      svelte: path.resolve('node_modules', 'svelte'),
    },
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/'
  },
};
