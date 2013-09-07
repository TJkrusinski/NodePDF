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
	}
````