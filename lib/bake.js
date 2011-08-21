var fs = require("fs"),
    cjson = require("cjson"),
    props = require("props"),
    dive = require("dive"),
    ejs = require("ejs");

// Main function
var bake = function(confFile, hooks) {

	// File counter
	var todo = 0;

	// Ensure hooks is an object
	if (typeof hooks !== "object")
		hooks = { };

	// Load the configuration file
	var conf = cjson.load(confFile);
	console.log("Successfully loaded configuration file.");

	// Set values for `bakeDir` and `tplDir`
	var bakeDir = conf.directories.bake || "pub",
	    tplDir = conf.directories.templates || "tpl";

	// Set values for `fileExt`
	var fileExt = conf.fileExtensions || { txt: "txt" };
	var fileExtPattern
			= new RegExp("\\.(" + Object.keys(fileExt).join("|") + ")$", "gi");

	// Status log
	console.log("Beginning to bake " + bakeDir + ".\n");

	// Dive into the public directory
	dive(bakeDir, function(err, master) {
		// Throw errors
		if (err) throw err;

		// Match the master-file's name against markdown file extensions
		if (master.match(fileExtPattern)) {

			// Increase file counter
			++todo;

			// Read the master-file's contents
			fs.readFile(master, "utf8", function(err, data) {
				// Throw errors
				if (err) throw err;

				// Get the properties
				// `file` is the file specific property object
				var file = props(data);
				// `global` is the global property object
				var global = conf.properties;

				// Assert that `file.template` is set
				if (file.template == undefined)
					file.template = global.defaultTemplate || "default";

				// Read the template file
				fs.readFile(tplDir + "/" + file.template + ".tpl", "utf8",
						function(err, result) {
					// Throw errors
					if (err) throw err;

					// For all keys of `global`
					for (var key in global)
						// If a hook is defined, apply it
						if (hooks[key] != undefined)
							global[key] = hooks[key](global);

					// For all keys of `file`
					for (var key in file)
						// If a hook is defined, apply it
						if (hooks[key] != undefined)
							file[key] = hooks[key](file);

					// (Pre-)Insert the content (so there may be ejs-tags in
					// `file.__content` are parsed, too.
					result = result.replace(/<%= +file.__content +%>/g,
							file.__content);

					// Result's filename
					var resultFilename = master.replace(fileExtPattern, ".html");

					// Export `file` and `global` to locals object for use in the
					// template.
					var locals = {
						file: file,
						global: global
					};

					// Render ejs-template
					result = ejs.render(result, { locals: locals });

					// Write contents
					fs.writeFile(resultFilename, result, function(err) {
						// Throw errors
						if (err) throw err;

						// Log status on success
						console.log("  " + resultFilename + " written.\n");

						// When file counter is zero
						if (!--todo) {
							if (hooks["__complete"] != undefined)
								// Call the completion hook
								hooks["__complete"]();

							// State final message
							console.log("Everything has been successfully baked!");
						}
					});
				});
			});
		}
	});
};

module.exports = bake;
