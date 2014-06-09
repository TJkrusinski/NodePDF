var child = require('child_process');
var os = require('os');

exports.exec = function(cmd, cb){
	var key;

	return child.exec(cmd, function(err, stdo, stde){
		cb ? cb(err) : null;
	});
};

exports.supports = function(cb, cmd) {
	var stream = child.exec('which '+(cmd || 'phantomjs'), function(err, stdo, stde){
		return cb(!!stdo.toString());
	});
};

exports.getArgMax = function(cb) {
	var command;
	var type = os.type();

	if (type === 'Linux' || type === 'Darwin') {
		command = 'getconf ARG_MAX';
	} else if (type === 'win32') {
		return cb(null, 8191);
	} else {
		return cb();
	}

	child.exec(command, function(err, stdo, stde) {
		if (!err) {
			if (!stde) {
				return cb(null, parseInt(stdo.substr(0, stdo.length-1)));
			} else {
				return cb(stde);
			}
		} else {
			return cb(err);
		}
	});
};
