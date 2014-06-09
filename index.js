var	child = require('./child.js');
var Emitter = require('events').EventEmitter;

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

/**
 *	Constructor interface
 */
var exports = module.exports = Pdf;

function Pdf (url, fileName, opts){
	var self = this;

	this.url = url;
	this.fileName = fileName;
	this.filePath = process.env.PWD || process.cwd() || __dirname;
	this.options = merge(defaults, opts);

	child.supports(function(support){
		if (!support) self.emit('error', 'PhantomJS not installed');
		if (support) self.run();
	});

	return this;
};

/**
 *	Inherit the event emitter
 */
Pdf.prototype = Object.create(Emitter.prototype);

/**
 *	Run the process
 *	@method run
 */
Pdf.prototype.run = function() {
	var self = this;
  
	var cmd = ['phantomjs'];
		cmd.push(this.options.args);
		cmd.push(__dirname+'/render.js');
		cmd.push("'"+this.url+"'");
		cmd.push("'"+this.fileName+"'");
		cmd.push("'"+JSON.stringify(this.options)+"'");
		cmd = cmd.join(' ');
  
	var ps;
	child.getArgMax(function(err, argMax) {
		if (err) {
			self.emit('error', err);
		} else if (!argMax || cmd.length < argMax) {
			ps = child.exec(cmd);
		} else {
			self.emit('error', 'content exceeds maximum length');
		}

		if (ps) {
			ps.on('exit', function(c, d){
				if (c != 0) return self.emit('error', 'PDF conversion failed with exit of '+c);

				var targetFilePath = self.fileName;
				if (targetFilePath[0] != '/') {
					targetFilePath = self.filePath + '/' + targetFilePath;
				};

				self.emit('done', targetFilePath);
			});

			ps.on('error', function(err) {
				self.emit('error', err);
			});

			ps.stdout.on('data', function(std){
				self.emit('stdout', std);
			});

			ps.stderr.on('data', function(std){
				self.emit('stderr', std);
			});
		}
	});
};

/**
 *	Use callback style rendering
 *	@function render
 *	@param {String} address
 *	@param {String} file
 *	@param {Options} address
 *	@param {Function} callback
 */
exports.render = function(address, file, options, callback) {
	var filePath = process.env.PWD || process.cwd() || __dirname;

	if (typeof options == 'function') {
		callback = options;
		options = defaults;
	};

	options = merge(defaults, options);

	child.supports(function(support){
		if (!support) callback(true, 'PhantomJS not installed');

		var cmd = ['phantomjs'];
			cmd.push(options.args);
			cmd.push(__dirname+'/render.js');
			cmd.push("'"+address+"'");
			cmd.push("'"+file+"'");
			cmd.push("'"+JSON.stringify(options)+"'");
			cmd = cmd.join(' ');
  
		var ps;
		child.getArgMax(function(err, argMax) {
			if (err) {
				return callback(true, err);
			} else if (!argMax || cmd.length < argMax) {
				ps = child.exec(cmd);
			} else {
				return callback(true, 'content exceeds maximum length');
			}

			ps.on('exit', function(c, d){
				if (c) return callback(true, 'Conversion failed with exit of '+c);

				var targetFilePath = file;

				if (targetFilePath[0] != '/')
					targetFilePath = filePath + '/' + targetFilePath;

				return callback(false, targetFilePath);
			});
		});
	});
};
