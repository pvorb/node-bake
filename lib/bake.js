var fs = require("fs"),
    cjson = require("cjson"),
    props = require("props"),
    dive = require("dive"),
    marked = require("marked");

// Main function
var bake = function(dir, hooks) {

	// File counter
	var todo = 0;

	// Load the configuration file
	var conf = cjson.load(dir + "/conf/bake.json");

	// Status log
	console.log("Beginning to bake " + dir);

	// Dive into the public directory
	dive(dir + "/pub", function(err, file) {
		// Throw errors
		if (err) throw err;

		// Match the file's name against markdown file extensions
		if (file.match(/\.(mkd|md|markdown)$/i)) {

			++todo;

			// Read the file's contents
			fs.readFile(file, "utf8", function(err, data) {
				// Throw errors
				if (err) throw err;

				// Get the properties of the file
				var p = props(data);

				// Parse markdown
				var content = marked(p.__content);

				// Assert p.template is set
				if (p.template == undefined)
					p.template = conf.defaultTemplate;

				// Assert p.author is set
				if (p.author == undefined)
					p.author = conf.defaultAuthor;

				// Read the template file
				fs.readFile(dir + "/tpl/" + p.template + ".tpl", "utf8",
						function(err, tpl) {
					// Throw errors
					if (err) throw err;

					// Insert the content
					tpl = tpl.replace("{__content}", content);

					// For all keys of conf.properties in tpl
					if (conf.properties != undefined)
						for (var key in conf.properties)
							// If a hook is defined, apply it
							if (hooks[key] != undefined)
								tpl = hooks[key](tpl, p, conf.properties);
							// Otherwise simply replace the key
							else
								tpl = tpl.replace(new RegExp("{" + key + "}", "g"),
										conf.properties[key]);

					// For all keys of p in tpl
					for (var key in p)
						// exept for p.__content
						if (key != "__content")
							// If a hook is defined, apply it
							if (hooks[key] != undefined)
								tpl = hooks[key](tpl, p, conf.properties);
							// Otherwise simply replace the key
							else
								tpl = tpl.replace(new RegExp("{" + key + "}", "g"),
									p[key]);

					// New filename
					htmlFile = file.replace(/\.(mkd|md|markdown)$/i, "") + ".html";
					// Write contents
					fs.writeFile(htmlFile, tpl, function(err) {
						// Throw errors
						if (err) throw err;
						// Log on success
						console.log(htmlFile + " written");

						if (!--todo)
							console.log("Everything has been successfully baked!");
					});
				});
			});
		}
	});
};

module.exports = bake;
