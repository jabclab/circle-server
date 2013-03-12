var person = new require('../lib/core').Person;
	rewire = require('rewire'),
	rw_core = rewire('../lib/core'),
	errRegEx = /^(\w|\s)+$/;

describe('Person', function() {
	describe('#getName()', function() {
		it('should return "Jake" if odd number passed in', function() {
			person.getName(3).should.equal('Jake');
			person.getName(9).should.equal('Jake');
			person.getName(3291).should.equal('Jake');
		});
		it('should return "John" if odd number passed in', function() {
			person.getName(0).should.equal('John');
			person.getName(2).should.equal('John');
			person.getName(122).should.equal('John');
		});
	});
	describe('#save()', function() {
		it('should throw an error if specified person to save is not an object', function() {
			var callback = sinon.spy();

			person.save(function() {}, callback);

			callback.should.have.been.calledWithMatch(errRegEx);
		});
		it('should call callback with an error if object to save does not contain a `name` property', function() {
			var callback = sinon.spy();

			person.save({}, callback);

			callback.should.have.been.calledWithMatch(errRegEx);
		});
		it('should not throw an error if object is passed and contains a `name` property', function(done) {
			var callback = sinon.spy();

			person.save({ name: 'Jake Clarkson' }, function(err, records) {
				callback(err, records);
				done();
				callback.should.have.been.calledWith(null);
			});
		});
		it('should call callback with an error if opening Mongo client fails', function(done) {
			var callback = sinon.spy();

			// Mock the `client` variable in the core.js file to call the callback passed to it with
			// a not null error specified when the `open` method is called on it.
			rw_core.__set__('client', {
				open: function(callback) {
					callback('error');
				}
			});

			Object.create(rw_core.Person).save({ name: 'Jake' }, function(err, records) {
				callback(err, records);
				done();
				callback.should.have.been.calledWithMatch(errRegEx);
			});
		});
		it('should call callback with an error if inserting document fails', function(done) {
			var callback = sinon.spy();

			rw_core.__set__('client', {
				open: function(callback) {
					// The `open` method should work
					callback(null, {
						db: function(name) {
							return {
								collection: function(name) {
									return {
										insert: function(obj, callback) {
											callback('error');
										}
									}
								}
							}
						},
						close: function() {
						}	
					});
				}
			});

			Object.create(rw_core.Person).save({ name: 'Jake' }, function(err, records) {
				callback(err, records);
				done();
				callback.should.have.been.calledWithMatch(errRegEx);
			});
		});
	});
});
