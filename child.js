var child = require('child_process'),
	shq = require('shell-quote').quote;

var which = process.platform == 'win32' ? 'where' : 'which';

exports.exec = function(url, filename, options, cb){
	var key,
		stdin = ['phantomjs'];

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

exports.supports = function(cb, cmd) {
	var stream = child.exec(which+' '+(cmd || 'phantomjs'), function(err, stdo, stde){
		return cb(!!stdo.toString());
	});
};
