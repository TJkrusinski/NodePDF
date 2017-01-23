var page = require('webpage').create();
var system = require('system');

// ADDRESS CHANGE IN PARAMETERS HANDLING FOR PHANTOMJS 2.x
var phantomargs;
if(phantom.version.major >= 2) {
  // remove the script name from the arguments
  phantomargs = system.args.slice(1,system.args.length);
} else {
  phantomargs = phantom.args;
}

var contentsCb = function(pobj) {
  if (!pobj || !pobj.contents) return;
  var contentStr = pobj.contents;
  pobj.contents = phantom.callback(function(currentPage, pages) {
    return contentStr.replace(/\{currentPage\}/g, currentPage).replace(/\{pages\}/g, pages);
  });
};

var args;

if (phantom.args) {
    args = phantom.args
} else {
    args = require('system').args;
}

if (args.length < 2) {
  console.log('11');
  console.log('incorrect args');
  phantom.exit();
} else {
  var optionsFile = args[3];
  var options = require(optionsFile);

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

  if (!options.content) page.open(args[0]);

  page.onLoadFinished = function(status) {
    if(status !== 'success'){
      console.log('error: ' + status);
      console.log('unable to load the address!');
      phantom.exit();
    } else {
      window.setTimeout(function(){
        page.render(args[1], { format: 'pdf', quality: options.outputQuality || '80' });
        console.log('success');
        phantom.exit();
      }, options.captureDelay || 400);
    };
  }
};
