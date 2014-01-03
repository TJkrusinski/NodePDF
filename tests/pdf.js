'use strict';

var assert = require('assert');

var Pdf = require('../index.js'),
	child = require('../child.js'),
	FP = process.env.PWD || process.cwd() || __dirname;

describe('child#supports()', function(){
	it('checks to see if phantomjs is installed', function(d){
		child.supports(function(exists){
			assert.ok(exists);
			d();
		});
	});
});

describe('child#supports()', function(){
	it('checks to see if foobarbaz is installed', function(d){
		child.supports(function(exists){
			assert.ok(!exists);
			d();
		}, 'foobarbaz');
	});
});

// google vs yahoo


describe('pdf#done()', function(){
	it('fires done when ', function(d){
		this.timeout(20000);
		var pdf1 = new Pdf('http://www.google.com', 'google.pdf');
		pdf1.on('done', function(msg){
			assert.ok(msg);
			assert.equal(FP + '/google.pdf', msg);
			d();
		});
		pdf1.on('error', function(msg){
			assert.ok(false);
			d();
		});
	});
});

describe('pdf#done()', function(){
	it('fires done when ', function(d){
		this.timeout(20000);
		var pdf2 = new Pdf('http://yahoo.com', 'yahoo.pdf', {
			viewportSize: {
				width: 3000,
				height: 9000
			},
			paperSize: {
				pageFormat: 'A4',
				margin: {
					top: '2cm'
				},
				'header': {
					'height': '4cm',
					'contents': 'HEADER {currentPage} / {pages}'
				},
				'footer': {
					'height': '4cm',
					'contents': 'FOOTER {currentPage} / {pages}'
				}
			},
			zoomFactor: 1.1
		});
		pdf2.on('done', function(msg){
			assert.ok(msg);
			assert.equal(FP + '/yahoo.pdf', msg);
			d();
		});
		pdf2.on('error', function(msg){
			assert.ok(false);
			console.log(msg);
		});
	});
});
