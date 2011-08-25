var fs = require("fs"),
    props = require("props"),
    dive = require("dive"),
    ejs = require("ejs");

// Main function
var bake = function(conf, hooks) {

	// File counter
	var todo = 0;

	// Ensure `conf` is an object
	if (typeof conf === "string")
		conf = JSON.parse(conf);
	if (typeof conf !== "object")
		throw new Error("parameter conf must be a valid configuration object");

	// Ensure `hooks` is an object
	if (typeof hooks !== "object")
		hooks = { };

	// Set values for `bakeDir` and `tplDir`
	var bakeDir = conf.directories.bake || "pub",
	    tplDir = conf.directories.templates || "tpl";

	// Set values for `fileExt`
	var fileExt = conf.fileExtensions || { txt: "html" };
	var fileExtPattern
			= new RegExp("\.(" + Object.keys(fileExt).join("|") + ")$", "i");

	// Status log
	console.log("Beginning to bake " + bakeDir + ".\n");

	// Dive into the public directory
	dive(bakeDir, function(err, master) {
		// Throw errors
		if (err) throw err;

		// Matching variable
		var match;

		// Match the master-file's name against enabled file extensions
		if (match = master.match(fileExtPattern)) {

			// Get the file extension of the master file
			var masterExt = match[1];

			// Increase file counter
			++todo;

			// Read the master-file's contents
			fs.readFile(master, "utf8", function(err, data) {
				// Throw errors
				if (err) throw err;

				// Get the properties
				// `prop` is the file specific property object
				var prop = props(data);

				// Amend `prop` by properties in `conf.properties` if defined
				if (conf.properties != undefined)
					for (var key in conf.properties) {
						if (prop[key] == undefined)
							prop[key] = conf.properties[key];
					}

				// Assert that `prop.template` is set
				if (prop.template == undefined)
					prop.template = "default.tpl";

				// `__propBefore` hook
				if (hooks.__propBefore != undefined)
					prop = hooks.__propBefore(master, prop);

				// Various property hooks
				for (var key in prop)
					if (hooks[key] != undefined)
						prop[key] = hooks[key](master, prop);

				// `__propAfter` hook
				if (hooks.__propAfter != undefined)
					prop = hooks.__propAfter(master, prop);

				// Read the template file
				fs.readFile(tplDir + "/" + prop.template, "utf8",
						function(err, result) {
					// Throw errors
					if (err) throw err;

					// (Pre-)Insert the content (so there may be ejs-tags in
					// `prop.__content` are parsed, too.
					result = result.replace(/<%= +__content +%>/g,
							prop.__content);

					// Result's filename
					if (prop.__path == undefined)
						prop.__path = master.replace(fileExtPattern,
								"." + fileExt[masterExt]);

					// Render ejs-template
					result = ejs.render(result, { locals: prop });

					// Write contents
					fs.writeFile(prop.__path, result, function(err) {
						// Throw errors
						if (err) throw err;

						// `__written` hook
						if (hooks.__writeAfter != undefined)
							hooks.__writeAfter(master, prop);

						// Log status on success
						console.log("  " + prop.__path + " written.\n");

						// When file counter is zero
						if (!--todo) {
							// `__complete` hook
							if (hooks.__complete != undefined)
								hooks.__complete(master, prop);

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