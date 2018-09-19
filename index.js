'use strict'

// Import modules
const EXPRESS = require('express');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const BODY_PARSER = require('body-parser');
const fs = require('fs');
const ROUTES = require('./api/router');
const path = require('path');
const phpExpress = require('php-express')({
  binPath: 'php'
});

// Setup Express Routes
const httpApp = EXPRESS();
const httpsApp = EXPRESS();

// File constants
const ONE_YEAR = 31536000000;
const PORT = 8080;
const SECURE_PORT = 3000;
const CERT_LOC = '/etc/letsencrypt/live/www.penguindan.com/';
const ROUTER = ROUTES(EXPRESS.Router());


let cipher =  ['ECDHE-ECDSA-AES256-GCM-SHA384',
'ECDHE-RSA-AES256-GCM-SHA384',
'ECDHE-RSA-AES256-CBC-SHA384',
'ECDHE-RSA-AES256-CBC-SHA256',
'ECDHE-ECDSA-AES128-GCM-SHA256',
'ECDHE-RSA-AES128-GCM-SHA256',
'DHE-RSA-AES128-GCM-SHA256',
'DHE-RSA-AES256-GCM-SHA384',
'!aNULL',
'!MD5',
'!DSS'].join(':');

// Redirect HTTP connections to HTTPS
httpApp.get('*', function(req, res, next) {
	if(req.headers.host === "penguindan.com"){
		res.redirect('https://www.' + req.headers.host + req.url);
	}
	else{
		res.redirect('https://' + req.headers.host + req.url);
	}
});

httpsApp.use(helmet.hsts({
	maxAge:ONE_YEAR,
	includeSubdomains: true,
	force: true
}));

httpsApp.use(BODY_PARSER.urlencoded({extended: true}));
httpsApp.use(BODY_PARSER.json());
httpsApp.use('/', ROUTER);
httpsApp.set('view engine', 'pug');
httpsApp.set('views', path.join(__dirname, '/views'));
// Set up the PHP engine for the node project
httpsApp.engine('php', phpExpress.engine);
// Route all .php file to php-express
httpsApp.all(/.+\.php$/, phpExpress.router);
httpsApp.use(EXPRESS.static(__dirname + '/public'));

let options = {
	key: fs.readFileSync(CERT_LOC + 'privkey.pem'),
	cert: fs.readFileSync(CERT_LOC + 'fullchain.pem'),
	ciphers: cipher
};

https.createServer(options, httpsApp).listen(SECURE_PORT);
http.createServer(httpApp).listen(PORT);
