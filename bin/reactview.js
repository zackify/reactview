#!/usr/bin/env node


'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var concat = require('concat-stream');
var http = require('http');
var url = require('url');
var fs = require('fs');
var tty = require('tty');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var React = require('react');

require('babel/polyfill');

function getPropsFromStdin(cb) {
  if (tty.isatty(process.stdin)) return cb(null, {});

  process.stdin.pipe(concat(function (raw) {
    try {
      cb(null, JSON.parse(raw));
    } catch (e) {
      cb(e);
    }
  }));
}

var ReactView = (function () {
  function ReactView() {
    var _this = this;

    var props = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ReactView);

    var componentPath = process.cwd();
    var componentName = process.argv[2];
    var fullPath = '' + componentPath + '/' + componentName;
    this.port = 1337;
    //if the 3rd argument isn't a number, it is the component class name
    if (isNaN(process.argv[3]) && process.argv[3]) {
      var component = process.argv[3];
      //if they also passed a port
      if (process.argv[4]) this.port = process.argv[4];
    }
    //if the 3rd argument is a number, it's the port
    else if (!isNaN(process.argv[3])) this.port = process.argv[3];

    this.fullPath = fullPath;
    this.bundle = '' + __dirname + '/component/bundle.js';

    this.compiler = webpack({
      context: __dirname,
      entry: ['webpack/hot/dev-server', fullPath],
      output: {
        path: __dirname,
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          context: __dirname,
          test: /\.jsx?$/,
          loader: 'react-hot',
          exclude: /node_modules/
        }, {
          context: __dirname,
          test: /\.jsx?$/,
          loader: 'babel-loader?stage=0',
          exclude: /node_modules/
        }, {
          context: __dirname,
          test: /\.jsx?$/,
          loader: 'render-placement-loader',
          query: { props: props, component: component || '' },
          exclude: /node_modules/
        }, {
          context: __dirname,
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }]
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      plugins: [new webpack.HotModuleReplacementPlugin()]
    });

    this.compile().then(function () {
      try {
        _this.serve();
      } catch (e) {
        console.error(e);
      }
    });
  }

  _createClass(ReactView, [{
    key: 'compile',
    value: function compile() {
      var _this2 = this;

      var promise = new Promise(function (resolve, reject) {

        _this2.compiler.watch({ // watch options:
          aggregateTimeout: 300, // wait so long for more changes
          poll: true // use polling instead of native watchers
          // pass a number to set the polling interval
        }, function (err, stats) {
          if (err) {
            console.log(err);
            return reject();
          }

          var jsonStats = stats.toJson();

          if (jsonStats.errors.length > 0) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = jsonStats.errors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var error = _step.value;
                console.error(error);
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                  _iterator['return']();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }

            return reject();
          }

          if (jsonStats.warnings.length > 0) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = jsonStats.warnings[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var warning = _step2.value;
                console.warn(warning);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                  _iterator2['return']();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            return reject();
          }
          console.log('Successfully Compiled');
          return resolve(true);
        });
      });
      return promise;
    }
  }, {
    key: 'serve',
    value: function serve() {
      var server = new WebpackDevServer(this.compiler, {
        contentBase: __dirname,
        hot: true,
        quiet: false,
        noInfo: false,
        lazy: true,
        filename: 'bundle.js',
        watchDelay: 300 });
      server.listen(this.port, 'localhost', function () {});

      console.log('running on http://localhost:' + this.port);
    }
  }]);

  return ReactView;
})();

getPropsFromStdin(function (err, props) {
  if (err) throw err;
  new ReactView(props);
});