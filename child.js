var child = require('child_process');

module.exports = function(url, filename, options){
	var key,
		stdin = ['phantomjs', 'render.js', url, filename];
	
	stdin.push(options.width);
	stdin.push(options.height);
	
	return child.exec(stdin.join(' '));
};