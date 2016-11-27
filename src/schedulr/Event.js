function Event(startTime, endTime, activity){
	this.startTime = startTime;
	this.endTime = endTime;
	this.activity = activity;
};

Event.from = function(startTime, endTime, activity){
	if(typeof startTime !== 'number' || typeof endTime !== 'number'){
		console.error('Event::from::invalid param');
		return;
	}

	var startDate = new Date(startTime);
	var endDate = new Date(endTime);
	var events = [];
	while(startDate < endDate && startDate.toDateString() !== endDate.toDateString()){
		var dayEndTime = new Date(startDate.valueOf()).setHours(23,59,59,999);
		events.push(new Event(startDate.valueOf(), dayEndTime.valueOf(), activity));
		startDate = new Date(startDate.setHours(0,0,0,0).valueOf()).setDate(startDate.getDate() + 1);
	}
	events.push(new Event(startDate.valueOf(), endDate.valueOf(), activity));
	return events;
}
module.exports = Event;
// class Event
// attr_accessor :startTime
// attr_accessor :endTime
// attr_accessor :activity
//
// def initialize(startTime, endTime, activity)
// @startTime = startTime
// @endTime = endTime
// @activity = activity
// end
// end
//
// def Event.create(startTime, endTime, activity)
// events = []
// while startTime.day < endTime.day
// 	dayEndTime = Time.new(endTime.year, endTime.month, endTime.day+1, 23, 59, 59)
// events << Event.new(startTime, dayEndTime, activity)
// startTime = Time.new(startTime.year, startTime.month, startTime.day+1)
// end
//
// events << Event.new(startTime, endTime, activity)
// end