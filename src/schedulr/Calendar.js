var Day = require('./Day');
var Event = require('./Event');

function Calendar(){
	this.days = [];

}
Calendar.prototype.getDay = function(time){
	return this.days.find(day => new Date(day.time).toDateString() === new Date(time).toDateString());
};

Calendar.prototype.addEvent = function(startTime, endTime, activity){
	events = Event.from(startTime, endTime, activity);
	events.map((event)=>{
		var day = this.getDay(event.startTime);
		if(!day){
			day = new Day(event.startTime);
			this.days.push(day)
		}
		day.addEvent(event);
	})
};

Calendar.prototype.removeEvent = function(startTime, endTime, activity){
	events = Event.from(startTime, endTime, activity);
	events.map((event)=>{
		var day = this.getDay(event.startTime);
		day.removeEvent(event);
	})
};

module.exports = Calendar;