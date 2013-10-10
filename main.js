var settings = require('./settings.json');

var createDiff = function (object1, object2, addedPrefix, removedPrefix, modifiedPrefix) {

	addedPrefix = addedPrefix || settings.addedPrefix;
	removedPrefix = removedPrefix || settings.removedPrefix;
	modifiedPrefix = modifiedPrefix || settings.modifiedPrefix;

	if (!object1 && !object2) {
		return null;
	}

	if (typeof object2 !== 'object') {
		return object2;
	}

	if (typeof object1 !== 'object' && typeof object2 === 'object') {
		return JSON.parse(JSON.stringify(object2));
	}

	if (Object.keys(object1).length === 0 && Object.keys(object2).length === 0) {
		return null;
	}

	if (object1 && (!object2 || Object.keys(object2).length === 0)) {
		return JSON.parse(JSON.stringify(addPrefix(object1, removedPrefix)));
	}

	if (object2 && (!object1 || Object.keys(object1).length === 0)) {
		return JSON.parse(JSON.stringify(addPrefix(object2, addedPrefix)));
	}

	var diff = {};

	for (var key1 in object1) {

		if (Object.keys(object2).indexOf(key1) < 0) {

			// Element removed
			diff[removedPrefix + key1] = JSON.parse(JSON.stringify(object1[key1]));

		} else {

			if (JSON.stringify(object1[key1]) !== JSON.stringify(object2[key1])) {

				// Element modified
				diff[modifiedPrefix + key1] = createDiff(object1[key1], object2[key1], addedPrefix, removedPrefix, modifiedPrefix);
			}
		}
	}

	for (var key2 in object2) {

		if (Object.keys(object1).indexOf(key2) < 0) {

			// Element added
			diff[addedPrefix + key2] = JSON.parse(JSON.stringify(object2[key2]));
		}
	}

	return diff;
};


/**
 * Adds a prefix to every attribute recursively
 */
var addPrefix = function (obj, prefix) {

	if (!obj || !prefix || Array.isArray(obj) || typeof obj !== 'object' || Object.keys(obj).length === 0) {
		return obj;
	}

	for (var key in obj) {

		if (!obj.hasOwnProperty(key)) {
			continue;
		}

		obj[key] = addPrefix(obj[key], prefix);

		obj[prefix + key] = obj[key];
		delete obj[key];
	}

	return obj;
};

// EXPORTS ======================================================================

exports.addPrefix = addPrefix;
exports.diff = createDiff;
