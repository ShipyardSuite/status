exports.files = {
	javascripts: { joinTo: 'app.js' },
	stylesheets: { joinTo: 'app.css' }
};

exports.plugins = {
	babel: { presets: [ 'latest', 'react' ] },
	uglify: {
		mangle: false,
		compress: {
			global_defs: {
				DEBUG: false
			}
		}
	},
	cleancss: {
		keepSpecialComments: 0,
		removeEmpty: true
	},
	autoReload: { enabled: true }
};
