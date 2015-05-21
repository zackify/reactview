#!/usr/bin/env node

'use strict'

var concat = require('concat-stream');
var http = require('http')
var url = require('url')
var fs = require('fs')
var tty = require('tty');
var open = require("open");

var webpack = require('webpack')
var WebpackDevServer =require('webpack-dev-server')
var React = require('react')

require('babel/polyfill')

function getPropsFromStdin (cb) {
  if (tty.isatty(process.stdin)) return cb(null, {})

  process.stdin.pipe(concat(raw => {
    try {
      cb(null, JSON.parse(raw))
    }
    catch (e) {
      cb(e)
    }
  }))
}

class ReactView{

  constructor(props={}){
    var componentPath = process.cwd()
    var componentName = process.argv[2]
    var fullPath = `${componentPath}/${componentName}`
    this.port = 1337
    //if the 3rd argument isn't a number, it is the component class name
    if(isNaN(process.argv[3]) && process.argv[3]){
      var component = process.argv[3]
      //if they also passed a port
      if(process.argv[4]) this.port = process.argv[4]
    }
    //if the 3rd argument is a number, it's the port
    else if(!isNaN(process.argv[3])) this.port = process.argv[3]

    this.fullPath = fullPath
    this.bundle = `${__dirname}/component/bundle.js`

    this.compiler = webpack({
      context: __dirname,
      entry: ['webpack/hot/dev-server',fullPath],
      output: {
           path: __dirname + "/component",
           filename: "bundle.js",
           publicPath: 'http://localhost:1339/'
      },
      module: {
          loaders: [
              {
                  test: /\.jsx$/,
                  loader: 'babel-loader?stage=0'
              },
              {
                  test: /\.jsx$/,
                  loader: 'render-placement-loader',
                  query: { props: props, component: component || '' }
              },
              { 
                test: /\.css$/,
                loader: "style-loader!css-loader" 
              },

          ]
      },
      resolve: {
          extensions: ['', '.js', '.jsx']
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    })

    this.compile()
    .then(() => {
      try{
        this.serve()
      }
      catch(e){
        console.error(e)
      }
    })

  }

  compile(){
     var promise = new Promise((resolve, reject) => {
      
      this.compiler.watch({ // watch options:
        aggregateTimeout: 300, // wait so long for more changes
        poll: true // use polling instead of native watchers
        // pass a number to set the polling interval
      },
      function(err, stats) {
        if(err) {
          console.log(err)
          return reject()
        }
        
        var jsonStats = stats.toJson()
        
        if(jsonStats.errors.length > 0) {
          for (var error of jsonStats.errors) console.error(error)
          return reject()
        }

        if(jsonStats.warnings.length > 0) {
          for (var warning of jsonStats.warnings) console.warn(warning)
          return reject()
        }
        console.log('Successfully Compiled')
        return resolve(true)
      })

    })
    return promise
  }

  serve(){
    var server = new WebpackDevServer(this.compiler, {
      // webpack-dev-server options
      contentBase: __dirname,
      // or: contentBase: "http://localhost/",

      hot: true,
      // Enable special support for Hot Module Replacement
      // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
      // Use "webpack/hot/dev-server" as additional module in your entry point
      // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does. 
      quiet: false,
      noInfo: false,
      lazy: true,
      filename: "/component/bundle.js",
      watchDelay: 300,
      headers: { "X-Custom-Header": "yes" },
      stats: { colors: true },

      // Set this as true if you want to access dev server from arbitrary url.
      // This is handy if you are using a html5 router.
      historyApiFallback: false,

      // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
      // Use "*" to proxy all paths to the specified server.
      // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
      // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).

    });
    server.listen(1339, "localhost", function() {});

    console.log('running!')
  }
}

getPropsFromStdin((err, props) => {
  if (err) throw err
  new ReactView(props)
});
