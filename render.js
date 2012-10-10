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
    page.open(phantom.args[0], function (status) {
		if(status !== 'success'){
			console.log('error');
			console.log('Unable to load the address!');
		} else {
			window.setTimeout(function(){
				page.render(phantom.args[1]);
				console.log('1');
				phantom.exit();
			}, 400);
		};
	});
};