// through2 is a thin wrapper around node transform streams
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// Consts
const PLUGIN_NAME = 'gulp-require-text-wrapper';

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

// Plugin level function(dealing with files)
function gulpRequireTextWrapper(prefixText) {


  // Creating a stream through which each file will pass
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // return empty file
      return cb(null, file);
    }
    if (file.isBuffer()) {
      //file.contents = Buffer.concat([prefixText, file.contents]);
      console.log('isBuffer');
    }
    if (file.isStream()) {
      //file.contents = file.contents.pipe(prefixStream(prefixText));
      console.log('isStream');
    }

    // convert to string from buffer
    var contents = file.contents.toString();

    // basic minify
    contents = contents.replace(/\n|\r|\t/g, ' ');

    // escape single quote
    contents = contents.replace(/'/g, "\\'");

    // wrap up as an amd module
    contents = "define(function() { return { text: '" + contents + "' }; });";

    // back to buffer
    contents = contents.toString('binary');
    contents = new Buffer(contents, "binary");

    file.contents = contents;

    cb(null, file);

  });

}

// Exporting the plugin main function
module.exports = gulpRequireTextWrapper;