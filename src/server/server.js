var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Schedulr = require('../schedulr/Schedulr');
var schedulr = new Schedulr();

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

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});