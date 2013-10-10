var settings = require('../settings.json');

var differ = require('../main.js');

var diff = differ.diff;
var addPrefix = differ.addPrefix;

var ok = (function () {
	var i = 1;
	return function (condition, message) {
		console.assert(condition, message);
		console.log('- Test %s passed ✓', ('00' + i).slice(-3));
		i += 1;
	};
}());

var addPrefixTests = [
	{
		object: {},
		prefix: 'pepe',
		expectedResult: {}
	},
	{
		object: {a: 2, b: 3},
		prefix: null,
		expectedResult: {a: 2, b: 3}
	},
	{
		object: {a: 2, b: 3},
		prefix: '-',
		expectedResult: {'-a': 2, '-b': 3}
	},
	{
		object: {a: {b: 3, c: [1, 2]}, d: 'pepe'},
		prefix: '-',
		expectedResult: {'-a': {'-b': 3, '-c': [1, 2]}, '-d': 'pepe'}
	}
];

var diffTests = [
	{
		object1: null,
		object2: null,
		expectedDiff: null
	},
	{
		object1: undefined,
		object2: undefined,
		expectedDiff: null
	},
	{
		object1: {},
		object2: {},
		expectedDiff: null
	},
	{
		object1: {a: 1, b: 3, c: '239429j2398472j23o239'},
		object2: {},
		expectedDiff: {'-#a': 1, '-#b': 3, '-#c': '239429j2398472j23o239'}
	},
	{
		object1: {},
		object2: {a: 1, b: 3, c: '239429j2398472j23o239'},
		expectedDiff: {'+#a': 1, '+#b': 3, '+#c': '239429j2398472j23o239'}
	},
	{
		object1: {a: 1, c: '2399', x: 0},
		object2: {a: 1, b: 3, c: '239429j2398472j23o239'},
		expectedDiff: {'~#c': '239429j2398472j23o239', '-#x': 0, '+#b': 3}
	},
	{
		object1: {
			a: 1,
			b: {b1: 6, b2: 1}
		},
		object2: {
			a: 2,
			c: 1,
			b: {b1: 6}
		},
		expectedDiff: {
			'~#a': 2,
			'~#b': {'-#b2': 1},
			'+#c': 1
		}
	},
	{
		object1: {
			c: 1,
			b: {b1: 6, b2: 1}
		},
		object2: {
			a: 2,
			b: {
				b1: {
					b11: 8,
					b12: 'pedrito'
				},
				b2: null
			}
		},
		expectedDiff: {
			'-#c': 1,
			'~#b': {
				'~#b1': {
					b11: 8,
					b12: 'pedrito'
				},
				'~#b2': null
			},
			'+#a': 2
		}
	},
	{
		object1: {
			a: 4,
			c: {
				c1: {
					c11: {
						c111: 2,
						c112: 3
					},
					c12: null
				}
			}
		},
		object2: {
			a: 4,
			b: 4,
			c: {
				c1: 3,
				c2: null
			}
		},
		expectedDiff: {
			'~#c': {
				'~#c1': 3,
				'+#c2': null
			},
			'+#b': 4
		}
	},
	{
		object1: {
			a: 4,
			c: {}
		},
		object2: {
			a: 4,
			b: 4,
			c: {
				c1: {
					c11: {
						c111: 2,
						c112: 3
					},
					c12: null
				},
				c2: null
			}
		},
		expectedDiff: {
			'~#c': {
				'+#c1': {
					c11: {
						c111: 2,
						c112: 3
					},
					c12: null
				},
				'+#c2': null
			}
		}
	}

];

(function () {

	addPrefixTests.forEach(function (t) {
		var expected = JSON.stringify(t.expectedResult);
		var got = JSON.stringify(addPrefix(t.object, t.prefix));
		ok(got === expected, 'Prefix Test failed: ' + JSON.stringify(t) + '\nExpected: ' + expected + '\nGot:     ' + got);
	});

	diffTests.forEach(function (t) {
		var expected = JSON.stringify(t.expectedDiff);
		var got = JSON.stringify(diff(t.object1, t.object2, '+#', '-#', '~#'));
		ok(expected === got, 'Diff Test failed: ' + JSON.stringify(t) + '\nExpected: ' + expected + '\nGot:     ' + got);
	});
}());
