var child = require('child_process');

exports.child = function(url, filename, options){
	var key,
		stdin = ['phantomjs'];

	stdin.push(options.args);
	stdin.push(__dirname+'/render.js');
	stdin.push("'"+url+"'");
	stdin.push("'"+filename+"'");
	stdin.push(options.width);
	stdin.push(options.height);
	stdin.push(options.pageFormat);
	stdin.push(options.pageOrientation);
	stdin.push("'"+options['margin-top']+"'");
	stdin.push("'"+options['margin-right']+"'");
	stdin.push("'"+options['margin-bottom']+"'");
	stdin.push("'"+options['margin-left']+"'");
	stdin.push(options.pageZoom);

	return child.exec(stdin.join(' '));
};

exports.dir = __dirname;