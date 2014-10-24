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

  if (options.cookies) {
    options.cookies.forEach(page.addCookie);
    delete options.cookies;
  }

  for (var key in options) {
    if (options.hasOwnProperty(key) && page.hasOwnProperty(key)) {
      page[key] = options[key];
    }
  }

  if (!options.content) page.open(phantom.args[0]);

  page.onLoadFinished = function(status) {
    if(status !== 'success'){
      console.log('error: ' + status);
      console.log('unable to load the address!');
      phantom.exit();
    } else {
      window.setTimeout(function(){
        page.render(phantom.args[1], { format: 'pdf' });
        console.log('success');
        phantom.exit();
      }, options.captureDelay || 400);
    };
  }
};
