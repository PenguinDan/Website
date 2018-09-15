'use strict'

const MIDDLEWARE = require('./middleware');

let router;

const routing = function routing(express_router){
	router = express_router;
	// Loads the main page for the viewer to see
	router.route('/').get(function (req, res) {
		MIDDLEWARE.loadMainPage(req, res);
	});

	return router;
};

module.exports = routing;
