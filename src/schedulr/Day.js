var Event = require('./Event');

function Day(time) {
	this.events = [];
	this.name = 'TODO : implement date name';
	this.time = time;
}

Day.prototype.addEvent = function (event) {
	this.events.push(event);
};

Day.prototype.copy = function(){
	var copy = new Day(this.time);
	copy.events = this.events.map(x => x.copy());
	return copy;
};

module.exports = Day;