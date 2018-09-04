var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require('request');
var path = require('path');
// const axios = require('axios');
const phrase = fs.readFileSync(path.resolve('./ssl/phrase')).toString();
// const qs = require('qs');
const express = require('express');

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}; 
const client_id = 'TRADER_V4@AMER.OAUTHAP';
const redirect_uri = 'https://localhost:443';
const url = `https://api.tdameritrade.com/v1/oauth2/token/`;

//SSL cert
const credentials = {
    key: fs.readFileSync(path.resolve('./ssl/server.key')),
    cert: fs.readFileSync(path.resolve('./ssl/server.crt')),
    passphrase: phrase
};

const app = express();

app.get('/', function(req, res){
	const code = req.query.code;
    const options = {
                //see the Authentication API's Post Access Token method for more information
		url: 'https://api.tdameritrade.com/v1/oauth2/token',
		method: 'POST',
		headers: headers,
                //POST Body params
		form: {
			'grant_type': 'authorization_code',
			'access_type': 'offline',
			code,
			client_id,
			redirect_uri
		}
	}
        
        //Post Access Token request
	request(options, function(error, response, body) {
		//see Post Access Token response summary for what authReply contains
			const authReply = JSON.parse(body);
			fs.writeFile('./ssl/access_token.json',JSON.stringify({
				access_token: authReply.access_token,
				refresh_token: authReply.refresh_token,
				access_expires_by: Date.now() + (authReply.expires_in * 1000),
				refresh_expires_by: Date.now() + (authReply.refresh_token_expires_in * 1000)
			}),()=> console.log('access API written OK'));
			            			
			//the line below is for convenience to test that it's working after authenticating
			res.send(authReply);
		
	})
	
	// function errorHandler (err, req, res, next) {
	// 	res.status(500)
	// 	res.render('error', { error: err })
//}
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//Set to 8080, but can be any port, code will only come over https, even if you specified http in your Redirect URI
httpServer.listen(8080, console.log('server is on 8080'));
httpsServer.listen(443, console.log('https is on'));