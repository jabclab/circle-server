var person = require('../lib/core').Person;
	rewire = require('rewire'),
	errRegEx = /^(\w|\s)+$/,
	data = {
		validPerson: { name: 'Jake' }
	};

describe('Person', function() {
	describe('#save()', function() {
		var rewiredCore = {};

		beforeEach(function() {
			rewiredCore = rewire('../lib/core');
		});

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

			person.save(data.validPerson, function(err, records) {
				callback(err, records);
				done();
				callback.should.have.been.calledWith(null);
			});
		});
		it('should call callback with an error if opening Mongo client fails', function(done) {
			var callback = sinon.spy(),
				client = rewiredCore.__get__('client');

			sinon.stub(client, 'open', function(callback) {
				callback('error');
			});

			rewiredCore.__set__('client', client);

			rewiredCore.Person.save(data.validPerson, function(err, records) {
				callback(err, records);
				done();
				callback.should.have.been.calledWithMatch(errRegEx);
			});
		});
		it('should call callback with an error if inserting document fails', function(done) {
			var callback = sinon.spy(),
				client = rewiredCore.__get__('client');
			
			// Stub the `open` method of the `client` `Object`
			sinon.stub(client, 'open', function(callback) {
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
			});

			rewiredCore.__set__('client', client);

			rewiredCore.Person.save(data.validPerson, function(err, records) {
				callback(err, records);
				done();
				callback.should.have.been.calledWithMatch(errRegEx);
			});
		});
	});
});
