var fs = require('fs');
var path = require('path');
var marked = require('marked');
var bake = require('../bake.js');

var a = {};

// Read the configuration file
var conf = fs.readFileSync(path.resolve(process.cwd(), 'conf/bake.json'),
    'utf8');

// Bake some markdown files
bake(conf, {
  __content: function(filename, properties) {
    return marked(properties.__content);
  }
});
