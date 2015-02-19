module.exports = function (grunt) {

	grunt.loadNpmTasks('grunt-contrib-compress');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		compress: {
			main: {
				options: {
					archive: 'deploy.zip'
				},
				files: [
					{expand: true, cwd: './', src: [
						'node_modules/**',
						'public/**',
						'btc-stats.js',
						'gruntfile.js',
						'package.json'
					]}
				]
			}
		}

	});


	grunt.registerTask('default', ['compress']);
};