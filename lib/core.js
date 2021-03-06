// http://mongodb.github.com/node-mongodb-native/driver-articles/mongoclient.html
var mongo = require('mongoskin'),
	Server = mongo.Server,
	MongoClient = mongo.MongoClient,
	client = new MongoClient(new Server('localhost', 27017)),
	Person = {};

exports.Person = Person;

Person.save = function(person, callback) {
	if (!(typeof person === 'object' && person)) {
		// If it's not an object or null then call callback with err specified
		callback('person must be an object and not null or undefined');
	} else if (!person.hasOwnProperty('name')) {
		// If the `person` `Object` doesn't contain a `name` property then call callback
		// with an error specified.
		callback('object to be saved must contain a name property');
	} else {
		client.open(function (err, openClient) {
			if (err) {
				callback(err);
			} else {
				var db = openClient.db('test');
				db.collection('people').insert(person, function (err, records) {
					// Always close even if there was an error doing the insertion. Always
					// close the client first just in case `callback` ends up not returning.
					openClient.close();

					if (err) {
						callback(err);
					} else {
						callback(null, records);
					}
				});
			}
		});	
	}
};