'use strict';

var child = require('child_process');
var shq = require('shell-quote').quote;
var which = process.platform == 'win32' ? 'where' : 'which';

/**
 *  Execute the command
 *
 *  @param {String} url
 *  @param {String} filename
 *  @param {Object} options
 *  @param {Function} [cb]
 */
exports.exec = function(url, filename, options, cb){
  var key;
  var stdin = ['phantomjs'];

  stdin.push(options.args);
  stdin.push(shq([
    __dirname+'/render.js',
    url,
    filename,
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
  var stream = child.exec(which+' '+(cmd || 'phantomjs'), function(err, stdo, stde){
    return cb(!!stdo.toString());
  });
};
