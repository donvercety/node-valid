/* jshint -W117 */

var validate = require('../validate.js');
var assert   = require('./assert.js');

var v = new validate();

// test values

var name  = 'Thomas Moser',
	user  = 'superuser',
	pass  = 'Str0ngP@ss',
	email = 'info@donvercety.biz',
	age   = 18,
	crazy = 'http:Ma$|er$B^|^@s^|^er$$(+_+)',
	ip    = '192.168.0.13',
	page  = 'https://my-page.com',
	phone = '359882205366',
	id    = 'ABC001',
	hello = 'aGVsbG8='; // base64

var bigBase64 = 'QmFzZTY0IGlzIGEgZ2VuZXJpYyB0ZXJtIGZvciBhIG51bWJlciBvZiBzaW1pbGFyIGVuY29kaW5nIHNjaGVtZXMgdGhhdCBlbmNvZGUgYmluYXJ5IGRhdGEgYnkgdHJlYXRpbmcgaXQgbnVtZXJpY2FsbHkgYW5kIHRyYW5zbGF0aW5nIGl0IGludG8gYSBiYXNlIDY0IHJlcHJlc2VudGF0aW9uLiBUaGUgQmFzZTY0IHRlcm0gb3JpZ2luYXRlcyBmcm9tIGEgc3BlY2lmaWMgTUlNRSBjb250ZW50IHRyYW5zZmVyIGVuY29kaW5nLg==';

var ass = new assert(), check = ass.check;

// simple tests

check(v.validate(age).min(16).isValid(), 'min');
check(v.validate(age).max(56).isValid(), 'max');

check(v.validate(age).min(21).isValid() === false, 'min');
check(v.validate(age).max(11).isValid() === false, 'max');

check(v.validate(user).minLength(8).isValid(), 'minLength');
check(v.validate(page).maxLength(50).isValid(), 'minLength');
check(v.validate(id).exactLength(6).isValid(), 'exactLength');

check(v.validate(user).minLength(18).isValid() === false, 'minLength');
check(v.validate(crazy).maxLength(11).isValid() === false, 'minLength');
check(v.validate(phone).exactLength(6).isValid() === false, 'exactLength');

check(v.validate(user).matches('superuser').isValid(), 'matches');
check(v.validate(user).matches('megauser').isValid() === false, 'matches');

check(v.validate(user).isAlpha().isValid(), 'isAlpha');
check(v.validate(phone).isNumeric().isValid(), 'isNumeric');
check(v.validate(id).isAlphaNumeric().isValid(), 'isAlphaNumeric');
check(v.validate(phone).isAlphaNumeric().isValid(), 'isAlphaNumeric');
check(v.validate(age).isInteger().isValid(), 'isAlphaNumeric');
check(v.validate(id).isAlpha().isValid() === false, 'isAlpha');
check(v.validate(ip).isAlphaNumeric().isValid() === false, 'isAlphaNumeric');
check(v.validate(ip).isAlphaDash().isValid() === false, 'isAlphaNumeric');


check(v.validate(hello).isBase64().isValid(), 'isBase64');
check(v.validate(bigBase64).isBase64().isValid(), 'isBase64');
check(v.validate(ip).isIP().isValid(), 'isIP');
check(v.validate(email).isEmail().isValid(), 'isEmail');
check(v.validate(page).isUrl().isValid(), 'isUrl');
check(v.validate(crazy).noWhitespace().isValid(), 'noWhitespace');
check(v.validate(crazy).isBase64().isValid() === false, 'isBase64');
check(v.validate(phone).isIP().isValid() === false, 'isIP');
check(v.validate(pass).isEmail().isValid() === false, 'isEmail');
check(v.validate(email).isUrl().isValid() === false, 'isUrl');
check(v.validate(crazy).isUrl().isValid() === false, 'isUrl');
check(v.validate(name).noWhitespace().isValid() === false, 'noWhitespace');

check(v.validate(page).isBase64().isValid() === false, 'isBase64');
check(v.validate(" ").isBase64().isValid() === false, 'isBase64');
check(v.validate(page).isEmail().isValid() === false, 'isEmail');
check(v.validate('n@ai').isEmail().isValid() === false, 'isEmail');

console.log(ass.getStatistics());
