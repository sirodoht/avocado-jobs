const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    authed: './main/frontend/authed/Avo.js',
    nonauthed: './main/frontend/nonauthed/Avo.js',
  },
  output: {
    filename: './main/static/main/scripts/bundle-[name].js',
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
