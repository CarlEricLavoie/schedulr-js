var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var params = require('./server_params');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Schedulr = require('../schedulr/Schedulr');
var schedulr = new Schedulr().load();

app.put('/initialize', function(req, res){
	res.json(schedulr = new Schedulr());
});

app.get('/activity/:name', function (req, res) {
	res.json(schedulr.get(req.params.name));
});

app.get('/activity', function(req, res){
	res.json(schedulr.list());
});

app.put('/activity/:name', function(req, res){
	var newName = req.body.name;
	res.json(schedulr.rename(req.params.name, newName));
});

app.delete('/activity/:name', function(req, res){
	res.json(schedulr.remove(req.params.name));
});

app.post('/activity', function(req, res){
	res.json(schedulr.add(req.body.name));
});

app.put('/current', function(req, res){
	res.json(schedulr.set(req.body.name));
});

app.get('/current', function(req, res){
	res.json(schedulr.current());
});

app.put('/timer', function(req, res){
	if(req.body.running){
		res.json(schedulr.start());
	}else{
		res.json(schedulr.stop());
	}
});

app.get('/timer', function(req, res){
	res.json(schedulr.timerRunning);
});

app.get('/day/:offset', function(req, res){
	res.json(schedulr.day(req.params.offset));
});
app.get('/day', function(req, res){
	res.json(schedulr.day());
});


if(app.get('env') === 'development'){
	app.put('/mock/time', function(req, res){
		var timestamp = req.body.timestamp;
		Date._now = Date.now;
		Date.now = () => timestamp;
		res.json(new Date(Date.now()));
	});

	//A bit too brutal. Will be kept only in dev mode for now
	app.delete('/', function(req, res){
		res.json(schedulr.cleanAll());
	});

	app.delete('/mock/time', function(req, res){
		Date.now = Date._now;
		res.json();
	})
}

app.listen(params.port, function () {
	console.log(`Server listening on port : ${params.port}`)
});

