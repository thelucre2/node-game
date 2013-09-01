
var fs		= require('fs')
,		http	= require('http')
,		express = require('express')
,		path = require('path')
,		mime = require('mime');

var cache = {};

var chatServer = require('./lib/chat_server');

var app = express();

fs.readFile('maps/test.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  map = JSON.parse(data);
});

//set path to the views (template) directory
app.set('views', __dirname + '/views');

//handle GET requests on /
app.get('/', function(req, res){
	res.render('index.jade', 
		{	title: 'tile map editor', 
			maps: [ "maps/test.json", "maps/worldmap.json" ],
			maptiles: [ "#c00", "#0c0", "#00c" ],
			latestmap : "maps/test.json"
		} 
	);
});

app.get('/maps/get/:map?', function(req, res, next){
    var map = req.params.map;
    wr('Map requested: ' + map);
    var handler = function(error, content){
	    if (error){
	    	wr('Map load failed: ' + map);
	      res.write(JSON.stringify({ "request" : "failed" }));
	      res.end();
	    }
	    else{
	    	wr('Map loaded: ' + map);
	    	var jsonmap = JSON.parse(content);
	      res.write(content);
	      res.end();
	    } 
	  }
    fs.readFile(__dirname + '/maps/' + map, handler);
});

app.get('/fortune/:type?', function(req, res, next){
    var fortuneType = req.params.type;
    wr('Fortune type requested: ' + fortuneType);
    var handler = function(error, content){
	    if (error){
	    	wr('Map load failed: ' + map);
	      res.write(JSON.stringify({ "request" : "failed" }));
	      res.end();
	    }
	    else{

	    	var jsonFortunes = JSON.parse(content);
	    	var yesnos = jsonFortunes.fortunes.yesnos;
	    	var dailies = jsonFortunes.fortunes.dailies;
	    	var secrets = jsonFortunes.fortunes.secrets;

	    	switch(fortuneType.toLowerCase()) {
	    		case 'daily':
	    			res.write(JSON.stringify( dailies[Math.floor( Math.random() * dailies.length)] ));
	    			break;
	    		case 'yesno':
	    			res.write(JSON.stringify( yesnos[Math.floor( Math.random() * yesnos.length)] ));
	    			break;
	    		case 'secret':
	    			res.write(JSON.stringify( secrets[Math.floor( Math.random() * yesnos.length)] ));
	    			break;
	    	}
	    	res.end();
	    } 
	  }
    fs.readFile(__dirname + '/fortune/fortunes.json', handler);
});

/***********************************************
 * CHAT CODE
 **********************************************/
function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"content-type": mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) {
		sendFile(response, absPath, cache[absPath]);
	} else {
		fs.exists(absPath, function(exists) {
			if (exists) {
				fs.readFile(absPath, function(err, data) {
					if (err) {
						send404(response);
					} else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			} else {
				send404(response);
			}
		});
	}
}



//listen on localhost:3000
var port = process.env.PORT || 3000;

var server = app.listen(port);
//var io = require('socket.io').listen(server);

chatServer.listen(server);

wr('Server started at port ' + port);

app.all(/^\/chat$/, function(req, res) { res.redirect('/chat/'); });
app.use('/chat/',express.static(__dirname+'/chat'));

app.all(/^\/game$/, function(req, res) { res.redirect('/game/'); });
app.use('/game/',express.static(__dirname+'/game'));

app.use("/css", express.static(__dirname + '/css'));

function wr( string ) {
	console.log(string);
}