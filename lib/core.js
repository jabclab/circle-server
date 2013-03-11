var Person = {};

Person.getName = function(index) {
	var name = 'default';

	if (!isNaN(index)) {
		if (index % 2 == 0) {
			name = 'John';
		}  else {
			name = 'Jake';
		}
	}

	return name;
}

Person.save = function() {
	var j = 2;
}

exports.Person = Person;