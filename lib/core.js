// https://github.com/christkv/node-mongodb-native/blob/master/docs/database.md
var mongoskin = require('mongoskin');
	Db = mongoskin.Db,
	Server = mongoskin.Server,
	db = new Db('people', new Server('localhost', 27017), {safe: false});

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

Person.save = function(person, callback) {
	if (!(typeof person == 'object' && person)) {
		// If it's not an object or null then call callback with err specified
		callback('person must be an object and not null or undefined');
	} else if (!person.hasOwnProperty('name')) {
		// If the `person` `Object` doesn't contain a `name` property then call callback
		// with an error specified.
		callback('object to be saved must contains a name property');
	} else {
		// Do the save and then call the callback
		callback(null);
	}
}

exports.Person = Person;