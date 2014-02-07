module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: {
					'build/jquery.swishCarousel.min.js': ['src/jquery.swishCarousel.js']
				}
			}
		},
		jshint: {
			src: ['src/jquery.swishCarousel.js'],
			build: ['build/jquery.swishCarousel.min.js']
		}
	});

	// Load uglify
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// Load jshint
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint:src','uglify']);
};