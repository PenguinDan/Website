'use strict'

const fs = require('fs');

const loadMainPage = function(req, res) {
	res.render('index');
	return res;
}

module.exports = {loadMainPage};
