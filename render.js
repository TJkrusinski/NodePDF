var page = require('webpage').create();

var contentsCb = function(pobj) {
	if (!pobj || !pobj.contents) return;
	var contentStr = pobj.contents;
	pobj.contents = phantom.callback(function(currentPage, pages) {
		return contentStr.replace(/\{currentPage\}/g, currentPage).replace(/\{pages\}/g, pages);
	});
}

if (phantom.args.length < 2) {
	console.log('11');
	console.log('incorrect args');
	phantom.exit();
} else {
	var options = JSON.parse(phantom.args[2]);

	contentsCb(options.paperSize.header);
	contentsCb(options.paperSize.footer);

	for (var key in options) {
		if (options.hasOwnProperty(key) && page.hasOwnProperty(key)) {
			page[key] = options[key];
		}
	}

	page.open(phantom.args[0], function (status) {
		if(status !== 'success'){
			console.log('error');
			console.log('Unable to load the address!');
		} else {
			window.setTimeout(function(){
				page.render(phantom.args[1]);
				console.log('1');
				phantom.exit();
			}, options.captureDelay || 400);
		};
	});
};