var person = new require('../lib/core').Person;

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
		it('should save the name under a key of name', function() {

		});
	});
});
