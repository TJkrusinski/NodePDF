# NodePDF

Down and dirty PDF rendering in Node.js

## Installation

````
npm install nodepdf
````

## Dependencies

1. PhantomJS

## API

```` javascript
var NodePDF = require('nodepdf');

// last argument is optional, sets the width and height for the viewport to render the pdf from. (see additional options)
var pdf = new NodePDF('http://www.google.com', 'google.pdf', {width:1440, height:900, args:'--debug=true'});

pdf.on('error', function(msg){
	console.log(msg);
});

pdf.on('done', function(pathToFile){
	console.log(pathToFile);
});

````

## Options
```` javascript
{
	width:1440,
	height:900,
	args:'--debug=true',
	pageFormat: 'A4', // ['A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid']
	pageOrientation: 'portrait', // ['portrait', 'landscape'],
	pageZoom: 1 // 1 = 100%, 0.5 = 50%, 1.5 = 150% ...
	margin: { // ['1cm', '1px', '1mm', '1in']
		top: '1cm',
		right: '1cm',
		bottom: '1cm',
		left: '1cm'
	},
	captureDelay: 400 // ms
}
````

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
