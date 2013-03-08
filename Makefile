# Makefile for circle-server. Inspiration taken from https://github.com/spumko/hapi/blob/master/Makefile.

# We always want mocha test runs to include sub directories
MOCHA_OPTS = --recursive

# By default use the dot reporter. For more see http://visionmedia.github.com/mocha/#reporters.
REPORTER = dot

# When we run `make test`, i.e. what is used by `npm test`, we will run unit tests and coverage tests.
test: test-unit test-cov

test-unit: 
	@NODE_ENV=test ./node_modules/.bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS)

# test-cov target will fail if defined coverage goal (in package.json scripts.travis-cov.threshold) is not met.
test-cov:
	@NODE_ENV=test ./node_modules/.bin/mocha --require blanket $(MOCHA_OPTS) --reporter travis-cov 

# test-cov-html target will get an HTML coverage report and then immediately open it in the default browser.
test-cov-html:
	@NODE_ENV=test ./node_modules/.bin/mocha --require blanket $(MOCHA_OPTS) --reporter html-cov > coverage.html
	open coverage.html

.PHONY: test test-cov-html
