    //?grant_type=authorization_code&refresh_token=&access_type=offline&code=${code}&client_id=${clientId}&redirect_uri=${redirectURI}

var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require('request');
var path = require('path');
const axios = require('axios');
const phrase = fs.readFileSync(path.resolve('./ssl/phrase')).toString();
const qs = require('qs');

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}; 
const client_id = 'TRADER_V4@AMER.OAUTHAP';
const redirect_uri = 'https://localhost:443';
const url = `https://api.tdameritrade.com/v1/oauth2/token/`;

//SSL cert
var credentials = {
    key: fs.readFileSync(path.resolve('./ssl/server.key')),
    cert: fs.readFileSync(path.resolve('./ssl/server.crt')),
    passphrase: phrase
};

var express = require('express');
var app = express();

app.get('/', function(req, res){
	const code = req.query.code;
    // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // console.log(code);
    // axios({
    //     method: 'POST',
    //     url: 'https://api.tdameritrade.com/v1/oauth2/token',
	// 	headers: headers,
    //             //POST Body params
	// 	form: {
	// 		grant_type: 'authorization_code',
	// 		access_type: 'offline',
	// 		code: code,
	// 		client_id: 'TRADER_V4%40AMER.OAUTHAP',
	// 		redirect_uri: 'https%3A%2F%2Flocalhost%3A443'
	// 	}
    // })
    // .then(rs => res.send(rs.data))
    // .catch(err => console.log(err))



    // res.send('Everything should be working now');

        	var options = {
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
			authReply = JSON.parse(body);
			fs.writeFile('./ssl/access_token.json',JSON.stringify({
				access_token: authReply.access_token,
				refresh_token: authReply.refresh_token,
				access_expires_by: Date.now() + (authReply.expires_in * 1000),
				refresh_expires_by: Date.now() + (authReply.refresh_token_expires_in * 1000)
			}),()=> console.log('access API written OK'));
			
            // authResponse = JSON.parse(response);
            //console.log({response});
			
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
httpServer.listen(8080, console.log('server is on 8888'));
httpsServer.listen(443, console.log('https is on'));