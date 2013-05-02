var Pdf = require('./index.js');

var pdf = new Pdf('http://google.com', 'google.pdf', {args: '--debug=true'});

pdf.on('done', function(msg){
	console.log(msg);
});

pdf.on('error', function(msg){
	console.log(msg);
});