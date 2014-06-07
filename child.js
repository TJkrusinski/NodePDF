var child = require('child_process');
var    os = require('os');

var getArgMax = function(callback) {
   var command;
   var type = os.type();

   if (type === 'Darwin' || type === 'Linux') {
      command = 'getconf ARG_MAX';
   } else if (type === 'win32') {
      return callback(null, 8191);
   } else {
      return callback();
   }

   child.exec(command, function(err, stdo, stde) {
      if (!err) {
         if (!stde) {
            return callback(null, parseInt(stdo.substr(0, stdo.length-1)));
         } else {
            return callback(stde);
         }
      } else { 
         return callback(err);
      }
   });
};

exports.exec = function(url, filename, options, cb){
	var key,
		stdin = ['phantomjs'];

	stdin.push(options.args);
	stdin.push(__dirname+'/render.js');
	stdin.push("'"+url+"'");
	stdin.push("'"+filename+"'");
	stdin.push("'"+JSON.stringify(options)+"'");

   getArgMax(function(err, data) {
      if (!err) {
         var command = stdin.join(' ');
         if (!data || command.length < data) {
	         return child.exec(command, function(err, stdo, stde){
		         cb ? cb(err) : null;
	         });
         } else {
            cb('content exceeds maximum length');
         }
      } else {
         cb(err);
      }
   });
};

exports.supports = function(cb, cmd) {
	var stream = child.exec('which '+(cmd || 'phantomjs'), function(err, stdo, stde){
		return cb(!!stdo.toString());
	});
};
