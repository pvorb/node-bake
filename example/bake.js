var bake = require("bake"),
    marked = require("marked");

// Bake some markdown files
bake(process.cwd() + "/conf/bake.json", {
	__content: function(filename, properties) {
		return marked(properties.__content);
	}
});
