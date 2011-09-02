var fs = require("fs"),
    marked = require("marked"),
    bake = require("../");

var a = {};

// Read the configuration file
var conf = fs.readFileSync(process.cwd() + "/conf/bake.json", "utf8");

// Bake some markdown files
bake(conf, {
	__content: function(filename, properties) {
		return marked(properties.__content);
	}
});
