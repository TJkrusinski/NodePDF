# nodepdf-series

Fork of [nodepdf](https://github.com/TJkrusinski/NodePDF) to support
multiple/series of pages:

```js
var glob = require('glob');
var path = require('path');
var PDF = require('nodepdf-series');

glob('**/*.html', function(e, files){
	files = files.map(function(file){
		return path.resolve(file);
	});
	PDF.render(files, function(err){
		// will create /path/to/file1.pdf, /path/to/file2.pdf, etc
		console.log('done');
	});
});
```

Or:
```js
var PDF = require('nodepdf-series');
PDF.render(['http://host/page.html', 'http://host/'], function(err){
	// will create ./host/page.pdf and host.pdf
});
```

## Installation

````
npm install nodepdf-series
````

## Dependencies

1. PhantomJS

## Contsructor API

You can use nodepdf-series two ways, one is using a contstructor that returns
an instance of `EventEmitter`.

```` javascript
// last argument is optional, sets the width and height for the viewport to render the pdf from. (see additional options)
var pdf = new PDF('http://www.google.com', {
	viewportSize: {
		width: 1440,
		height: 900
	},
	args: '--debug=true'
});

pdf.on('error', function(msg){
	console.log(msg);
});

pdf.on('done', function(){
	console.log('done');
});

// listen for stdout from phantomjs
pdf.on('stdout', function(stdout){
	 console.log(stdout);
});

// listen for stderr from phantomjs
pdf.on('stderr', function(stderr){
	console.log(stderr);
});

````
Or set the content directly instead of using a URL (will save to about:blank.pdf):
```` javascript
var pdf = new PDF(null, {
	content: '<html><body><img src="https://www.google.com/images/srpr/logo11w.png" alt="google"/></body></html>'
});
````


You can set the header and footer contents aswell:
```` javascript
var pdf = new PDF('http://yahoo.com', {
	header: {
		height: '1cm',
		contents: 'HEADER {currentPage} / {pages}' // If you have 2 pages the result looks like this: HEADER 1 / 2
	},
	footer: {
		height: '1cm',
		contents: 'FOOTER {currentPage} / {pages}'
	}
});
````

## Callback API

The callback API follows node standard callback signatures using the `render()` method.

```` javascript
var PDF = require('nodepdf-series');

// options is optional
PDF.render('http://www.google.com', options, function(err){
	// handle error
});

// use default options
PDF.render('http://www.google.com', function(err){
	// handle error
});

````

As soon the content option is set, the URL is ignored even if you set one.

## Options + Defaults
```` javascript
{
	viewportSize: {
		width: 2880,
		height: 1440
	},
	paperSize: {
		format: 'A4',
		orientation: 'portrait',
		margin: {
			top: '1cm',
			right: '1cm',
			bottom: '1cm',
			left: '1cm'
		}
	},
	zoomFactor: 1,
	args: '',
	captureDelay: 0
}
````

You can set all the properties from here: http://phantomjs.org/api/webpage/

## Cookies

```` javascript
var pdf = new PDF('http://yahoo.com', {
	cookies: [
		{
			name:     'Valid-Cookie-Name 1',   /* required property */
			value:    'Valid-Cookie-Value 1',  /* required property */
			domain:   'localhost',           /* required property */
			path:     '/foo',
			httponly: true,
			secure:   false,
			expires:  (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
		},
		{
			name:     'Valid-Cookie-Name 2',
			value:    'Valid-Cookie-Value 2',
			domain:   'localhost'
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
