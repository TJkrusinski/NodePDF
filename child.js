var child = require('child_process');

exports.child = function(url, filename, options){
	var key,
		stdin = ['phantomjs'];

	stdin.push(options.args);
	stdin.push(__dirname+'/render.js');
	stdin.push(url);
	stdin.push(filename);
	stdin.push(options.width);
	stdin.push(options.height);

	return child.exec(stdin.join(' '));
};

exports.dir = __dirname;