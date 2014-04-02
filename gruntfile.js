module.exports = function(grunt) {
	grunt.initConfig({
		path: require('path'),
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				} // close .globals
			}, // close .options
			gruntfile: {
				src: ['gruntfile.js'],
			},
			sourceFiles: {
				src: ['src<%= path.sep %>js<%= path.sep %>*.js'],
			}
		}, // close jshint
		uglify: {
			sourceFiles: {
				files: {
					'jquery.syntaxhighlighter.min.js': ['jquery.syntaxhighlighter.js']
				}
			}
		}, // close uglify
		watch: {
			gruntfile: {
				files: ['gruntfile.js'],
				tasks: ['jshint:gruntfile'],
				options: {
					spawn: false
				}
			}, // close gruntfile

			jsfiles: {
				files: ['*.js','!gruntfile.js'],
				tasks: ['jshint:sourceFiles','uglify:sourceFiles'],
				options: {
					spawn: false
				}
			} // close jsfiles
		} // close watch
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
}; // close module.exports
