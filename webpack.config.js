const path = require('path')
module.exports = {
  mode: 'production',
  devtool: "source-map",
  entry: {
    PadSquad: ['./src/PSDom', './src/PSToolKit'],
    PSBackToSurvey: {
      dependOn: 'PadSquad',
      import: './src/PSBackToSurvey/PSBackToSurvey.js',
      filename: '[name].min.js',
    },
    "PSBackToSurvey.bundle": {
      import: './src/PSBackToSurvey/PSBackToSurvey.js',
      filename: '[name].min.js',
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.js'
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
