var page = require('webpage').create();

var contentsCb = function(pobj) {
  if (!pobj || !pobj.contents) return;
  var contentStr = pobj.contents;
  pobj.contents = phantom.callback(function(currentPage, pages) {
    return contentStr.replace(/\{currentPage\}/g, currentPage).replace(/\{pages\}/g, pages);
  });
}

if (phantom.args.length < 1) {
  console.log('11');
  console.log('incorrect args');
  phantom.exit();
} else {
  var options = JSON.parse(phantom.args[1]);

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

  var urls;
  function process() {
    if (urls.length > 0) {
      url = urls[0];
      urls.splice(0, 1);
      // add extra / on windows: file://C:/url -> file:///C:/url
      url = url.replace(/file\:\/\/([A-Z])\:/, 'file:///$1:');
      page.open(url);
    } else {
      phantom.exit();
    }
  }

  if (!options.content) {
    urls = JSON.parse(phantom.args[0]);
    if (!Array.isArray(urls)) urls = [urls];
    process();
  } else {
    urls = [];
  }

  page.onLoadFinished = function(status) {
    if(status !== 'success'){
      console.log('error: ' + status);
      console.log('unable to load ' + page.url);
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
