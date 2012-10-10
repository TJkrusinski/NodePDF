# NodePDF

Down and dirty PDF rendering in Node.js

## Installation

````
npm install nodePDF
````

## API

````
var NodePDF = require('nodePDF');

var pdf = new NodePDF('http://www.google.com', 'google.pdf');

pdf.on('error', function(msg){
	console.log(msg);
});

pdf.on('done', function(msg){
	console.log(msg);
});

````