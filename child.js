'use strict';

var child = require('child_process');
var shq = require('shell-quote').quote;
var which = process.platform == 'win32' ? 'where' : 'which';
var fs = require('fs');

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
  var optsFile = __dirname + '/' + Date.now() + '.js';

  stdin.push(options.args);
  stdin.push(shq([
    __dirname+'/render.js',
    url,
    filename,
    optsFile,
  ]));

  fs.writeFile(optsFile, 'module.exports='+JSON.stringify(options), 'UTF-8', function(err) {
    if(err) {
      return console.log(err);
    }

    var c = child.exec(stdin.join(' '));
    c.on('exit', function () {
      fs.unlinkSync(optsFile);
    });

    c.on('error', function () {
      fs.unlinkSync(optsFile);
    });
    cb(c);
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
