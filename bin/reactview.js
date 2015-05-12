#!/usr/bin/env node
'use strict'

var http = require('http')
var url = require('url')
var fs = require('fs')

var webpack = require('webpack')
var React = require('react')

class ReactView{


	constructor(){
		var componentPath = process.cwd()
		var componentName = process.argv[2]
		var fullPath = componentPath + '/' + componentName
		this.fullPath = fullPath
		this.bundle = __dirname + "/component/bundle.js"
		this.compiler = webpack({
		  entry: fullPath,
		  output: {
		       path: __dirname + "/component",
		       filename: "bundle.js"
		  },
		  module: {
		      loaders: [
		          {
		              test: /\.jsx$/,
		              loader: 'babel-loader'
		          }

		      ]
		  },
		  resolve: {
		      extensions: ['', '.js', '.jsx']
		  }
		})

		this.compile()

	}

	compile(){
		this.compiler.run(function(err, stats) {
	    if(err)
	        return console.log(err);
	    
	    var jsonStats = stats.toJson();
	    
	    if(jsonStats.errors.length > 0)
	       return console.log(jsonStats.errors);
	    
	    if(jsonStats.warnings.length > 0)
	       console.log(jsonStats.warnings);
	    	
	    this.serve()
		}.bind(this));
	}

	serve(){
		http.createServer(function (req, res) {

			var location = url.parse(req.url,true).pathname

			if(location == '/bundle.js'){
				fs.readFile(this.bundle, function(error, content) {
					if (error) {
						res.writeHead(500);
						res.end();
					}
					else {
						res.writeHead(200, { 'Content-Type': 'text/javascript' });
						res.end(content, 'utf-8');
					}
				});
			}
			else {
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				res.end('<html><head><title>React View</title></head><body><script src="/bundle.js"></script></body></html>')
			}
		}.bind(this)).listen(1337);
		console.log('server started at localhost:1337!')
	}
}
new ReactView()