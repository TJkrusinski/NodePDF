var	child = require('./child.js');

module.exports = function(url, fileName, opts){
	var ps,
		readStream,
		self = this;

	if (!opts) opts = {};
	if (!opts.margin) opts.margin = {};

	this.url = url;
	this.fileName = fileName;
	this.filePath = process.env.PWD || process.cwd() || __dirname;
	
	this.options = {
		width: opts && opts.width ? parseInt(opts.width, 10)*2 : 2880,
		height: opts && opts.height ? parseInt(opts.height, 10)*2 : 1440,
		args : opts && opts.args ? opts.args : '',
		pageFormat: opts.pageFormat || 'A4',
		pageOrientation: opts.pageOrientation || 'portrait',
		pageZoom: opts.pageZoom || 1,
		'margin-top': opts.margin.top || '1cm',
		'margin-right': opts.margin.right || '1cm',
		'margin-bottom': opts.margin.bottom || '1cm',
		'margin-left': opts.margin.left || '1cm',
		'captureDelay': opts.captureDelay || 400
	};

	this.evts = {};
	this.on = function(evt, callback) {
		this.evts[evt] = callback;
	};

	child.supports(function(support){
		if (!support)
			self.evts['error'].call(this, 'PhanomJS not installed');
	});

	ps = child.exec(this.url, this.fileName, this.options);

	readStream = function(stream) {
		if (stream.toString('utf-8').length === 2) {
			self.evts['done'].call(this, self.filePath+'/'+self.fileName);
			ps.kill();
		} else {
			self.evts['error'].call(this, 'There was a problem');
		};
	};

	ps.stdout.on('data', function(std){
		readStream(std);
	});

	ps.stderr.on('data', function(std){
		self.evts['error'].call(self, std);
	});

	return this;
};
