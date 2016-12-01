var Day = require('./Day');
var Event = require('./Event');

function Calendar() {
	this.days = [];

}
Calendar.prototype.getDay = function (time) {
	return this.days.find(day => new Date(day.time).toDateString() === new Date(time).toDateString());
};

Calendar.prototype.addEvent = function (startTime, endTime, activity) {
	if(!startTime || !endTime || !activity){
		return;
	}
	events = Event.from(startTime, endTime, activity);

	events.map((event)=> {
		var day = this.getDay(event.startTime);
		if (!day) {
			day = new Day(event.startTime);
			this.days.push(day)
		}
		day.addEvent(event);
	})
};

/*
 Performance wise it would make more sense to add and remove activities to display daily schedule.
 Maintenance wise it makes more sense to deep copy and trash.
 */
Calendar.prototype.copy = function () {
	var copy = new Calendar();
	copy.days = this.days.map(x => x.copy());
	return copy;
};

module.exports = Calendar;