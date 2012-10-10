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

// last argument is optional, sets the width and height for the viewport to render the pdf from.
var pdf = new NodePDF('http://www.google.com', 'google.pdf', {width:1440, height:900});

pdf.on('error', function(msg){
	console.log(msg);
});

pdf.on('done', function(pathToFile){
	console.log(pathToFile);
});

````