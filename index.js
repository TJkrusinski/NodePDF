var	child = require('./child.js');

var defaults = {
	'viewportSize': {
		'width': 2880,
		'height': 1440
	},
	'paperSize': {
		'format': 'A4',
		'orientation': 'portrait',
		'margin': {
			'top': '1cm',
			'right': '1cm',
			'bottom': '1cm',
			'left': '1cm'
		}
	},
	'zoomFactor': 1,
	'args': '',
	'captureDelay': 400
};

//code from https://github.com/rxaviers/cldr
var merge = function() {
	var destination = {},
	sources = [].slice.call( arguments, 0 );
	sources.forEach(function( source ) {
		var prop;
		for ( prop in source ) {
			if ( prop in destination && Array.isArray( destination[ prop ] ) ) {
				// Concat Arrays
				destination[ prop ] = destination[ prop ].concat( source[ prop ] );
			} else if ( prop in destination && typeof destination[ prop ] === "object" ) {
				// Merge Objects
				destination[ prop ] = merge( destination[ prop ], source[ prop ] );
			} else {
				// Set new values
				destination[ prop ] = source[ prop ];
			}
		}
	});
	return destination;
};

module.exports = function(url, fileName, opts){
	var ps,
		readStream,
		self = this;

	this.url = url;
	this.fileName = fileName;
	this.filePath = process.env.PWD || process.cwd() || __dirname;

	this.options = merge(defaults, opts);
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
