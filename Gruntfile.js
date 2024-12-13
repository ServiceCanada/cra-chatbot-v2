module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dist: ['dist']
		},

		copy: {
			main: {
				files: [
					{
						expand: true,
						flatten: true,
						src: 'src/js/cra-chatbot-v2.js',
						dest: 'dist/',
					},
					{
						expand: true,
						flatten: true,
						src: 'src/css/cra-chatbot-v2.css',
						dest: 'dist/',
					}
				]
			}
		},

		uglify: {
			dist: {
				files: {
					'dist/cra-chatbot-v2.min.js': ['src/js/cra-chatbot-v2.js']
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'dist/cra-chatbot-v2.min.css': ['src/css/cra-chatbot-v2.css']
				}
			}
		},

		usebanner: {
			taskName: {
				options: {
					position: 'top',
					banner: '/*!\n * CRA Chat with Charlie / Clavardez avec Charlie de l\'ARC\n' +
					' * v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n*/',
					linebreak: true
				},
				files: {
					src: [ 'dist/cra-chatbot-v2.css', 'dist/cra-chatbot-v2.min.css', 'dist/cra-chatbot-v2.js', 'dist/cra-chatbot-v2.min.js' ]
				}
			}
		},

		htmllint: {
			all: {
				src: ['*.html']
			},

			options: {
				"attr-name-style": "dash",
				"attr-quote-style": false,
				"id-class-style": "dash",
				"indent-style": "tabs",
				"indent-width": 4,
				"line-end-style": "lf",
				"attr-no-unsafe-char": false
			}
		},

		jshint: {
			all: {
				options: {
					esversion: 11,
					'-W067': true	// To ignore Unorthodox function invocation
				},
				src: ['Gruntfile.js', 'src/js/*.js']
			}
		},

		eslint: {
			options: {
				overrideConfigFile: ".eslintrc.json",
				quiet: true
			},
			target: ['Gruntfile.js', 'src/js/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-htmllint');
	grunt.loadNpmTasks('grunt-eslint');

	grunt.registerTask('default', ['clean', 'htmllint', 'jshint', 'eslint', 'copy', 'uglify', 'cssmin', 'usebanner']);
	grunt.registerTask('dist', ['clean', 'htmllint', 'jshint', 'eslint', 'copy', 'uglify', 'cssmin', 'usebanner']);
};
