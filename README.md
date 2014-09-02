# NodePDF

Down and dirty PDF rendering in Node.js

[![Build Status](https://travis-ci.org/TJkrusinski/NodePDF.png?branch=master)](https://travis-ci.org/TJkrusinski/NodePDF)

## Installation

````
npm install nodepdf
````

## Dependencies

1. PhantomJS

## Contsructor API

You can use NodePDF two ways, one is using a contstructor that returns an instance of `EventEmitter`.

```` javascript
var NodePDF = require('nodepdf');

// last argument is optional, sets the width and height for the viewport to render the pdf from. (see additional options)
var pdf = new NodePDF('http://www.google.com', 'google.pdf', {
	'viewportSize': {
		'width': 1440,
		'height': 900
	}, 
	'args': '--debug=true'
});

pdf.on('error', function(msg){
	console.log(msg);
});

pdf.on('done', function(pathToFile){
	console.log(pathToFile);
});

// listen for stdout from phantomjs
pdf.on('stdout', function(stdout){
	 // handle
});

// listen for stderr from phantomjs
pdf.on('stderr', function(stderr){
	// handle
});

````
Or set the content directly instead of using a URL:
```` javascript
var pdf = new NodePDF(null, 'google.pdf', {
	'content': '<html><body><img src="https://www.google.com/images/srpr/logo11w.png" alt="google"/></body></html>',
	'viewportSize': {
		'width': 1440,
		'height': 900
	},
});
````


You can set the header and footer contents aswell:
```` javascript
var NodePDF = require('nodepdf');
var pdf = new NodePDF('http://yahoo.com', 'yahoo.pdf', {
	'viewportSize': {
		'width': 3000,
		'height': 9000
	},
	'paperSize': {
		'pageFormat': 'A4',
		'margin': {
			'top': '2cm'
		},
		'header': {
			'height': '1cm',
			'contents': 'HEADER {currentPage} / {pages}' // If you have 2 pages the result looks like this: HEADER 1 / 2
		},
		'footer': {
			'height': '1cm',
			'contents': 'FOOTER {currentPage} / {pages}'
		}
	},
	'zoomFactor': 1.1
});
````

## Callback API

The callback API follows node standard callback signatures using the `render()` method.

```` javascript
var NodePDF = require('nodepdf');

// options is optional, sets the width and height for the viewport to render the pdf from. (see additional options)
NodePDF.render('http://www.google.com', 'google.pdf', options, function(err, filePath){
	// handle error and fielPath
});

// use default options
NodePDF.render('http://www.google.com', 'google.pdf', function(err, filePath){
	// handle error and fielPath
});

````

As soon the content option is set, the URL is ignored even if you set one.

## Options + Defaults
```` javascript
{
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
}
````

You can set all the properties from here: http://phantomjs.org/api/webpage/

## Cookies

```` javascript
var NodePDF = require('nodepdf');
var pdf = new Pdf('http://yahoo.com', 'yahoo.pdf', {
	'cookies': [
		{
			'name':     'Valid-Cookie-Name 1',   /* required property */
			'value':    'Valid-Cookie-Value 1',  /* required property */
			'domain':   'localhost',           /* required property */
			'path':     '/foo',
			'httponly': true,
			'secure':   false,
			'expires':  (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
		},
		{
			'name':     'Valid-Cookie-Name 2',
			'value':    'Valid-Cookie-Value 2',
			'domain':   'localhost'
		}
	]
});
````

PhantomJS Cookie Object description: http://phantomjs.org/api/webpage/property/cookies.html

## License

(The MIT License)

Copyright (c) 2013 TJ Krusinski &lt;tj@shoflo.tv&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
