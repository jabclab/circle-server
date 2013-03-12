// http://mongodb.github.com/node-mongodb-native/driver-articles/mongoclient.html
var mongo = require('mongoskin'),
	Server = mongo.Server,
	MongoClient = mongo.MongoClient,
	client = new MongoClient(new Server('localhost', 27017)),
	Person = {};

exports.Person = Person;

Person.getName = function(index) {
	var name = 'default';

	if (!isNaN(index)) {
		if (index % 2 === 0) {
			name = 'John';
		} else {
			name = 'Jake';
		}
	}

	return name;
};

Person.save = function(person, callback) {
	if (!(typeof person === 'object' && person)) {
		// If it's not an object or null then call callback with err specified
		callback('person must be an object and not null or undefined');
	} else if (!person.hasOwnProperty('name')) {
		// If the `person` `Object` doesn't contain a `name` property then call callback
		// with an error specified.
		callback('object to be saved must contain a name property');
	} else {
		client.open(function (err, client) {
			if (err) {
				callback(err);
			} else {
				var db = client.db('test');
				
				db.collection('people').insert(person, function (err, records) {
					if (err) {
						callback(err);
					} else {
						callback(null, records);
					}

					// Always close even if there was an error doing the insertion
					client.close();
				});
			}
		});	
	}
};