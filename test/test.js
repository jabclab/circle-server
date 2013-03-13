var person = require('../lib/core').Person;
	rewire = require('rewire'),
	errRegEx = /^(\w|\s)+$/,
	data = {
		validPerson: { name: 'Jake' }
	};

describe('Person', function() {
	describe('#save()', function() {
		var rewiredCore = {},
			client,
			stubOpenMethod = function(insertCallback, close) {
				return function(callback) {
					callback(null, {
						db: function(name) {
							return {
								collection: function(name) {
									return {
										insert: insertCallback
									}
								}
							}
						},
						close: close || function () {}
					});	
				};
			};

		beforeEach(function() {
			rewiredCore = rewire('../lib/core');
			client = rewiredCore.__get__('client');
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
			var callback = sinon.spy();

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
			var callback = sinon.spy();
			
			// Stub the `open` method of the `client` `Object`
			sinon.stub(client, 'open', stubOpenMethod(function(obj, callback) {
				callback('error');
			}));

			rewiredCore.__set__('client', client);

			rewiredCore.Person.save(data.validPerson, function(err, records) {
				callback(err, records);
				done();
				callback.should.have.been.calledWithMatch(errRegEx);
			});
		});
		it('should close DB connection after insertion if inserting succeeded', function(done) {
			var closeSpy = sinon.spy();

			sinon.stub(client, 'open', stubOpenMethod(function(obj, callback) {
				callback(null, []);
			}, closeSpy));

			rewiredCore.__set__('client', client);

			rewiredCore.Person.save(data.validPerson, function(err, records) {
				done();
				closeSpy.should.have.been.called;
			});			
		});
		it('should close DB connection after insertion if inserting failed', function(done) {
			var closeSpy = sinon.spy();

			sinon.stub(client, 'open', stubOpenMethod(function(obj, callback) {
				callback('error');
			}, closeSpy));

			rewiredCore.__set__('client', client);

			rewiredCore.Person.save(data.validPerson, function(err, records) {
				done();
				closeSpy.should.have.been.called;
			});	
		});
	});
});
