function Event(startTime, endTime, activity){
	this.startTime = startTime;
	this.endTime = endTime;
	this.activity = activity;
};

Event.from = function(startTime, endTime, activity){
	if(typeof startTime !== 'number' || typeof endTime !== 'number'){
		return;
	}

	var startDate = new Date(startTime);
	var endDate = new Date(endTime);
	var events = [];
	while(startDate < endDate && startDate.toDateString() !== endDate.toDateString()){
		var dayEndTime = new Date(startDate.valueOf()).setHours(23,59,59,999);
		events.push(new Event(startDate.valueOf(), dayEndTime.valueOf(), activity));
		startDate = new Date(startDate.setHours(0,0,0,0).valueOf() + 1000 * 60 * 60 * 24);
	}
	events.push(new Event(startDate.valueOf(), endDate.valueOf(), activity));
	return events;
};

module.exports = Event;