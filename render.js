var page = require('webpage').create();

if (phantom.args.length < 2) {
	console.log('11');
	console.log('incorrect args');
    phantom.exit();
} else {
    page.viewportSize = {
		width: phantom.args[2] || 1440,
		height: phantom.args[3] || 2880
	};
	page.paperSize = {
		'format': phantom.args[4] || 'A4',
		'orientation': phantom.args[5] || 'portrait',
		'margin': {
			'top': phantom.args[6] || '1cm',
			'right': phantom.args[7] || '1cm',
			'bottom': phantom.args[8] || '1cm',
			'left': phantom.args[9] || '1cm'
		}
	};
	page.zoomFactor = phantom.args[10] || 1;
    page.open(phantom.args[0], function (status) {
		if(status !== 'success'){
			console.log('error');
			console.log('Unable to load the address!');
		} else {
			window.setTimeout(function(){
				page.render(phantom.args[1]);
				console.log('1');
				phantom.exit();
			}, phantom.args[11] || 400);
		};
	});
};