module.exports = {

  entry: './app.js',

  output: {
    filename: 'build.js'
  },

  watch: true,

  watchOptions: {
  	aggregateTimeout: 100
  },

	module: {
	  rules: [
	    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
	  ]
	}

};