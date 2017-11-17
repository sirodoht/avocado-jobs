module.exports = {
  entry: './main/frontend/app.js',
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
};
