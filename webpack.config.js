const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './main/frontend/Avo.js',
  output: {
    filename: './main/static/main/scripts/bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }
    ]
  },
  // plugins: [new BundleAnalyzerPlugin()],
};
