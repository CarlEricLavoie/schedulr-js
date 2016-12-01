function Day(time) {
	this.events = [];
	this.name = 'TODO : implement date name';
	this.time = time;
};

Day.prototype.addEvent = function (event) {
	this.events.push(event);
};

Day.prototype.removeEvent = function (event) {
	this.events = this.events.filter(e => e.activity === event.activity && e.startTime === event.startTime && e.endTime === event.endTime);
};

module.exports = Day;