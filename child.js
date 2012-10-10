var child = require('child_process');

exports.child = function(url, filename, options){
	var key,
		stdin = ['phantomjs', __dirname+'/render.js', url, filename];
	
	stdin.push(options.width);
	stdin.push(options.height);
	
	return child.exec(stdin.join(' '));
};

exports.dir = __dirname;