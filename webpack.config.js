var webpackDevServerEntry = 'webpack/hot/dev-server';
const { NODE_ENV } = process.env;
const PATH = ['./src/js/app.js'];

module.exports = {
  context: __dirname,
	devtool: 'inline-source-map',
  entry: {
    app: (NODE_ENV === 'prod') ? PATH : [webpackDevServerEntry].concat(PATH)
  },
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,   // A regexp to test the require path. accepts either js or jsx
      loader: 'babel'   // The module to load. "babel" is short for "babel-loader"
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
