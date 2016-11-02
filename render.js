var page = require('webpage').create();
var system = require('system');

var contentsCb = function(pobj) {
  if (!pobj || !pobj.contents) return;
  var contentStr = pobj.contents;
  pobj.contents = phantom.callback(function(currentPage, pages) {
    return contentStr.replace(/\{currentPage\}/g, currentPage).replace(/\{pages\}/g, pages);
  });
}

if (system.args.length < 2) {
  console.error('incorrect args');
  phantom.exit();
} else {
  var options = JSON.parse(system.args[2]);

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

  var urls, i;
  if (!options.content) {
    urls = JSON.parse(system.args[1]);
    if (!Array.isArray(urls)) {
      urls = [urls];
    }
    i = 0;
    process();
  }

  function process() {
    if (i < urls.length) {
      var url = urls[i++];
      // add extra / on windows: file://C:/url -> file:///C:/url
      url = url.replace(/file\:\/\/([A-Za-z])\:/, 'file:///$1:');
      page.open(url);
    } else {
      phantom.exit();
    }
  }

  page.onLoadFinished = function(status) {
    if(status !== 'success'){
      console.error('ERROR, status: ' + status);
      console.error('unable to load ' + urls[i]);
      process(); // recursive
    } else {
      window.setTimeout(function(){
        var out = page.url;
        out = out.replace(/^.*:\/\//, ''); // something://url -> 'url'
        out = out.replace(/(\.html|\/|)$/, '.pdf'); // if .html -> .pdf, else + .pdf
        if ((window.navigator.userAgent.indexOf("Windows") != -1) &&
            (out[0] == '/')) {
            out = out.substring(1);
        }
        console.log('saving to ' + out);
        page.render(out, { format: 'pdf' });
        process();
      }, options.captureDelay || 0);
    }
  };
}
