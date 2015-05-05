/**
 * Minify files with UglifyJS.
 *
 * ---------------------------------------------------------------
 *
 * Minifies client-side javascript `assets`.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function(grunt) {

	//grunt.config.set('uglify', {
	//	dist: {
	//		src: ['.tmp/public/concat/production.js'],
	//		dest: '.tmp/public/min/production.min.js'
	//	}
	//});

	grunt.config.set('uglify', {
		dist: {
      files: [
        {'.tmp/public/min/production.min.js': ['.tmp/public/concat/production.js']},
        // UserModule.js is not minifying correctly, leaving that out
        {'.tmp/public/js/private/admin/UserAdmin.js': ['.tmp/public/js/private/admin/UserAdmin.js']}
      ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};