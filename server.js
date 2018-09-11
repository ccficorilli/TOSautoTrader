//https://auth.tdameritrade.com/auth?response_type=code&redirect_uri=https%3A%2F%2Flocalhost%3A443&client_id=TRADER_V4%40AMER.OAUTHAP

const fs = require('fs');
const http = require('http');
const https = require('https');
const request = require('request');
const path = require('path');
const phrase = fs.readFileSync(path.resolve('./ssl/phrase')).toString();
const express = require('express');
const app = express();
//const axios = require('axios');
//const qs = require('qs');

const client_id = 'TRADER_V5@AMER.OAUTHAP';
const redirect_uri = 'https://localhost:448';


//SSL cert
const credentials = {
    key: fs.readFileSync(path.resolve('./ssl/server.key')),
    cert: fs.readFileSync(path.resolve('./ssl/server.crt')),
    passphrase: phrase
};

app.get('/', function(req, res){
	const code = req.query.code;
	console.log(code);
    const options = {
                //see the Authentication API's Post Access Token method for more information
		url: 'https://api.tdameritrade.com/v1/oauth2/token',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
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
			authReply = JSON.parse(body);
			fs.writeFile('./ssl/access_token.json',JSON.stringify({
				access_token: authReply.access_token,
				refresh_token: authReply.refresh_token,
				access_expires_by: Date.now() + (authReply.expires_in * 1000),
				refresh_expires_by: Date.now() + (authReply.refresh_token_expires_in * 1000)
			}),()=> console.log('access API written OK'));

			//the line below is for convenience to test that it's working after authenticating
			res.send(authReply);
		
	})
	//Need to write an error handler....
	// function errorHandler (err, req, res, next) {
	// 	res.status(500)
	// 	res.render('error', { error: err })
//}
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//Set to 8080, but can be any port, code will only come over https, even if you specified http in your Redirect URI
httpServer.listen(8080, console.log('server is on 8080'));
httpsServer.listen(448, console.log('https is on 448'));
