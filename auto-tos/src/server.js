var fs = require('fs');
var http = require('http');
var https = require('https');
var request = require('request');
var path = require('path');
const axios = require('axios');
const phrase = fs.readFileSync(path.resolve('../../ssl/phrase')).toString();

//SSL cert
// var privateKey  = fs.readFileSync('../../ssl/server.key', 'utf8');
// var certificate = fs.readFileSync('../../ssl/server.crt', 'utf8');
var credentials = {
    key: fs.readFileSync(path.resolve('../../ssl/server.key')),
    cert: fs.readFileSync(path.resolve('../../ssl/server.crt')),
    passphrase: phrase
};

var express = require('express');
var app = express();

app.get('/', function(req, res){
    const code = req.query.code; //get the code
    console.log(code);
    const url = 'https://api.tdameritrade.com/v1/oauth2/token/';
    
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.post({
        method: 'post',
        headers: 'application/x-www-form-urlencoded',
        url: url,
        data: {
            'grant_type': 'authorization_code',
            'refresh_token': '',
            'access_type': 'offline',
            'code': code, 
            'client_id': 'TRADER_V4@AMER.OAUTHAP',
            'redirect_uri': 'https://localhost:443'
            }
        }).then(response => {
            console.log(response.data);
            res.send(response.data);
        }).catch(err => console.log(err));
        // 	var options = {
//                 //see the Authentication API's Post Access Token method for more information
// 		url: 'https://api.tdameritrade.com/v1/oauth2/token',
// 		method: 'POST',
// 		headers: headers,
//                 //POST Body params
// 		form: {
// 			'grant_type': 'authorization_code',
// 			'access_type': 'offline',
// 			'code': req.query.code, //get the code
// 			'client_id': 'TRADER_V2%40AMER.OAUTHAP',
// 			'redirect_uri': 'https%3A%2F%2Flocalhost%3A443'
// 		}
// 	}
        
//         //Post Access Token request
// 	request(options, function(error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 			//see Post Access Token response summary for what authReply contains
//             authReply = JSON.parse(body);
//             console.log(authReply);
			
// 			//the line below is for convenience to test that it's working after authenticating
// 			res.send(authReply);
// 		}
// 	})
	
// 	function errorHandler (err, req, res, next) {
// 		res.status(500)
// 		res.render('error', { error: err })
// }
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

//Set to 8080, but can be any port, code will only come over https, even if you specified http in your Redirect URI
httpServer.listen(8080, console.log('server is on 8888'));
httpsServer.listen(443, console.log('https is on'));