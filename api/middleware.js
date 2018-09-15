'use strict'

const fs = require('fs');

const loadMainPage = function(req, res) {
	res.render('home', {
		name: 'Daniel'
	})
	return res;
}

module.exports = {loadMainPage};
