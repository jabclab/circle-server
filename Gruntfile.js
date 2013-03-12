'use strict';

module.exports = function(grunt) {
	var testTargets = ['env:test', 'blanket'],
		testFilePath = 'test/**/*.js',
		libFilePath = 'lib/**/*.js';

	grunt.initConfig({
		// https://npmjs.org/package/grunt-blanket
		// Files to instrument are defined in package.json scripts.
		blanket: {
			options: {}
		},
		// https://npmjs.org/package/grunt-simple-mocha
		simplemocha: {
			options: {
				require: ['test/common', 'blanket'],
				reporter: 'dot'
			},
			// Simply run the unit tests
			unit: {
				src: testFilePath
			},
			// Use travis-cov reporter to enforce a given % of coverage.
			cov: {
				src: testFilePath,
				options: {
					reporter: 'travis-cov'
				}
			},
			// Use the html-cov reporter to generate an HTML coverage report.
			// Remember to redirect output to coverage.html. 
			cov_html: {
				src: testFilePath,
				options: {
					reporter: 'html-cov'
				}
			}
		},
		// https://npmjs.org/package/grunt-env
		env: {
			options: {},
			test: {
				NODE_ENV: 'test'
			},
			dev: {
				NODE_ENV: 'dev'
			},
			production: {
				NODE_ENV: 'production'
			}
		},
		// https://npmjs.org/package/grunt-complexity
		// http://jscomplexity.org/complexity
		complexity: {
			src: ['Gruntfile.js', libFilePath],
			options: {
				cyclomatic: 3, // num of distinct paths through a block of code
				halstead: 9,
				maintainability: 80
			}
		},
		// https://npmjs.org/package/grunt-contrib-jshint
		// https://github.com/jshint/jshint/blob/master/examples/.jshintrc
		// https://github.com/gruntjs/grunt-cli/blob/master/Gruntfile.js
		jshint: {
			all: [
				'Gruntfile.js',
				libFilePath
			],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				eqnull: true,
				node: true,
				es5: true
			}
		},
		// https://npmjs.org/package/grunt-docco
		docco: {
			src: libFilePath,
			options: {
				output: 'docs/'
			}
		}
	});

	// Load grunt tasks
	[
		'blanket', 
		'simple-mocha', 
		'env', 
		'complexity', 
		'contrib-jshint', 
		'docco'
	].forEach(function(lib) {
		grunt.loadNpmTasks('grunt-' + lib);
	});

	// Register custom task runs
	grunt.registerTask('test', testTargets.concat(['simplemocha:unit', 'simplemocha:cov']));
	grunt.registerTask('test-html', testTargets.concat(['simplemocha:cov_html']));
	grunt.registerTask('qa', ['jshint', 'complexity']);
	grunt.registerTask('docs', ['docco']);
};