'use strict';

var child = require('child_process');
var shq = require('shell-quote').quote;
var fs = require('fs');
var phantomjs = require('phantomjs');

/**
 *  Execute the command
 *
 *  @param {String} url
 *  @param {Object} options
 *  @param {Function} [cb]
 */
exports.exec = function(url, options, cb){
  var key;
  var stdin = [phantomjs.path];

  stdin.push(options.args);
  stdin.push(shq([
    __dirname+'/render.js',
    JSON.stringify(url),
    JSON.stringify(options),
  ]));

  return child.exec(stdin.join(' '), function(err, stdo, stde){
    cb ? cb(err) : null;
  });
};

/**
 *  Check to see if the environment has a command
 */

exports.supports = function(cb, cmd) {
  fs.stat((cmd || phantomjs.path), function(err){
    cb(!err);
  });
};
