require.config({
	paths: {
		"underscore": "../lib/lodash/dist/lodash.underscore",
		"lodash": "../lib/lodash/dist/lodash",
		"template": "../lib/lodash-template-loader/loader",
		"jquery": "../lib/jquery/dist/jquery",
		"jquery-ui": "../lib/jquery-ui/jquery-ui",
		"backbone": "../lib/backbone/backbone",
		"localstorage": "../lib/backbone.localStorage/backbone.localStorage",
		"async": "../lib/requirejs-plugins/src/async",
		"icheck": "../plugins/iCheck/icheck",
		"colorbox": "../plugins/colorbox/jquery.colorbox"
	},

	deps: ["main", "common/Plugins", "common/Shims"],

	shim: {
		'jquery-ui': {
			deps: ['jquery']
		},
		'localstorage': {
			deps: ['backbone']
		},
		'icheck': {
			deps: ['jquery']
		},
		'colorbox': {
			deps: ['jquery']
		}
	},

	lodashLoader: {
		ext: ".tpl.html",
		root: "/public/app/templates",
		templateSettings: {}
	}
});
