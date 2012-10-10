var Pdf = require('./index.js');

var pdf = new Pdf('http://www.google.com', 'google.pdf');

pdf.on('done', function(msg){
	console.log(msg);
});

pdf.on('error', function(msg){
	console.log(msg);
});