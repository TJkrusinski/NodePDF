'use strict';

var assert = require('assert');

var Pdf = require('../index.js');
var child = require('../child.js');
var fs = require('fs');
var path = require('path');
var FP = process.env.PWD || process.cwd() || __dirname;

function exists(filename) {
  filename = FP + '/' + filename;
  try {
    var fd = fs.openSync(filename, 'r');
  } catch (e) {
    return false;
  }
  fs.close(fd);
  return true;
}

// clean up before and after
describe('all tests', function() {
  var files = ['httpbin.org.pdf', 'about\:blank.pdf', 'www.yahoo.com.pdf', 'httpbin.org/html.pdf'];
  function deleteAll(){
    files.forEach(function(filename){
      if (!exists(filename)) return;
      filename = path.join(FP, filename);
      console.log('deleting ' + filename);
      fs.unlinkSync(filename);
    });
  }
  before(deleteAll);
  after(deleteAll);

  describe('child#supports()', function(){
    it('checks to see if phantomjs is installed', function(d){
      child.supports(function(exists){
        assert(exists);
        d();
      });
    });
  });

  describe('child#supports()', function(){
    it('checks to see if asdfhijk is installed', function(d){
      child.supports(function(exists){
        assert(!exists);
        d();
      }, 'asdfhijk');
    });
  });

  // google vs yahoo

  describe('pdf#done() 1', function(){
    it('fires done when ', function(d){
      this.timeout(20000);
      var pdf1 = new Pdf('http://httpbin.org/');
      pdf1.on('done', function(){
        assert(exists('httpbin.org.pdf'));
        d();
      });
      pdf1.on('error', function(msg){
        console.log(msg);
        assert(false);
        d();
      });
    });
  });

  describe('pdf#content', function() {
    it('fires done when content is loaded', function(d) {
      this.timeout(5000);
      var pdf1 = new Pdf(null, {
        'content': '<html><body>Test</body></html>'
      });
      pdf1.on('done', function(){
        assert(exists('about\:blank.pdf'));
        d();
      });
      pdf1.on('error', function(msg){
        console.log(msg);
        assert(false);
        d();
      });
    })
  });

  describe('pdf#done() 2', function(){
    it('fires done when ', function(d){
      this.timeout(20000);
      var pdf2 = new Pdf('http://www.yahoo.com', {
        'viewportSize': {
          'width': 3000,
          'height': 9000
        },
        'paperSize': {
          'pageFormat': 'A4',
          'margin': {
            'top': '2cm'
          },
          'header': {
            'height': '4cm',
            'contents': 'HEADER {currentPage} / {pages}'
          },
          'footer': {
            'height': '4cm',
            'contents': 'FOOTER {currentPage} / {pages}'
          }
        },
        'zoomFactor': 1.1,
        'cookies': [
          {
            'name':     'Valid-Cookie-Name 1',   /* required property */
            'value':    'Valid-Cookie-Value 1',  /* required property */
            'domain':   'localhost',           /* required property */
            'path':     '/foo',
            'httponly': true,
            'secure':   false,
            'expires':  (new Date()).getTime() + (1000 * 60 * 60)   /* <-- expires in 1 hour */
          },
          {
            'name':     'Valid-Cookie-Name 2',
            'value':    'Valid-Cookie-Value 2',
            'domain':   'localhost'
          }
        ]
      });
      pdf2.on('done', function(){
        assert(exists('www.yahoo.com.pdf'));
        d();
      });
      pdf2.on('error', function(msg){
        assert(false);
        d();
      });
    });
  });

  describe('pdf#render()', function(){
    it('renders a pdf with a callback style', function(d){
      this.timeout(5000);
      Pdf.render('http://httpbin.org/html', function(err){
        assert.equal(err, null);
        assert(exists('httpbin.org/html.pdf'));
        d();
      });
    });
  });

});
