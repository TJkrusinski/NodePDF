var	child = require('./child.js');

module.exports = function(url, filename, opts){
	var ps,
		readStream,
		me = this;
	this.evts = {};

	this.options = {
		width: opts && opts.width ? parseInt(opts.width, 10)*2 : 2880,
		height: opts && opts.height ? parseInt(opts.height, 10)*2 : 1440
	};
	
	this.url = url;
	this.filename = filename;
	
	this.on = function(evt, callback){
		this.evts[evt] = callback;
	};
	
	ps = child.child(this.url, this.filename, this.options);
	
	readStream = function(stream){
		if(stream.toString('utf-8').length === 2){
			me.evts['done'].call(this, process.env.PWD+'/'+filename);
			ps.kill();
		} else {
			me.evts['error'].call(this, 'There was a problem');
		};
	};
	
	ps.stdout.on('data', function(std){
		//console.log('stdout from phantom: '+std);
		readStream(std);
	});
	
	ps.stderr.on('data', function(std){
		me.evts['error'].call(me, std);
	});
	
	return this;
};