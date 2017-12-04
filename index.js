user = require('./user/index');

console.log('hi');

var vasya = new user.User('Вася');
var petya = new user.User('Петя');

petya.hello(vasya);
