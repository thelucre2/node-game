
var http	= require('http')
,		fs		= require('fs')
,		express = require('express');
//create an app server
var app = express();

var map;

fs.readFile('maps/test.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  map = JSON.parse(data);
});

//set path to the views (template) directory
app.set('views', __dirname + '/views');
app.all(/^\/game$/, function(req, res) { res.redirect('/game/'); });
app.use('/game/',express.static(__dirname+'/game'));
app.use("/css", express.static(__dirname + '/css'));
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

//listen on localhost:3000
var port = process.env.PORT || 3000;
app.listen(port);
wr('Server started at port ' + port);


function wr( string ) {
	console.log(string);
}