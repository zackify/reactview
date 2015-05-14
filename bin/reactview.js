#!/usr/bin/env node


'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var http = require('http');
var url = require('url');
var fs = require('fs');
var open = require('open');

var webpack = require('webpack');
var React = require('react');

var ReactView = (function () {
	function ReactView() {
		_classCallCheck(this, ReactView);

		var componentPath = process.cwd();
		var componentName = process.argv[2];
		var fullPath = '' + componentPath + '/' + componentName;

		this.port = process.argv[3] || 1337;
		this.fullPath = fullPath;
		this.bundle = '' + __dirname + '/component/bundle.js';

		this.compiler = webpack({
			context: __dirname,
			entry: fullPath,
			output: {
				path: __dirname + '/component',
				filename: 'bundle.js'
			},
			module: {
				loaders: [{
					test: /\.jsx$/,
					loader: 'babel-loader?stage=0'
				}, {
					test: /\.jsx$/,
					loader: 'render-placement-loader'
				}]
			},
			resolve: {
				extensions: ['', '.js', '.jsx']
			}
		});

		this.compile();
	}

	_createClass(ReactView, [{
		key: 'compile',
		value: function compile() {
			this.compiler.run((function (err, stats) {
				if (err) return console.log(err);

				var jsonStats = stats.toJson();

				if (jsonStats.errors.length > 0) return console.log(jsonStats.errors);

				if (jsonStats.warnings.length > 0) console.log(jsonStats.warnings);

				this.serve();
			}).bind(this));
		}
	}, {
		key: 'serve',
		value: function serve() {
			http.createServer((function (req, res) {

				var location = url.parse(req.url, true).pathname;

				if (location == '/bundle.js') {
					fs.readFile(this.bundle, function (error, content) {
						if (error) {
							res.writeHead(500);
							res.end();
						} else {
							res.writeHead(200, { 'Content-Type': 'text/javascript' });
							res.end(content, 'utf-8');
						}
					});
				} else {
					res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
					res.end('<html><head><title>React View</title></head><body><script src="/bundle.js"></script></body></html>');
				}
			}).bind(this)).listen(this.port);
			open('http://localhost:' + this.port);
			console.log('running!');
		}
	}]);

	return ReactView;
})();

new ReactView();