function Day(time){
	this.events = [];
	this.name = 'TODO : implement date name';
	console.log('parse date!!!');
	this.time = Date.now();
};

module.exports = Day;
// class Day
// attr_accessor :time
// attr_accessor :name
// attr_accessor :events
//
// def add_event(event)
// @events << event
// end
//
// def initialize(time)
// @events = []
// @name = time.strftime("%A, %d/%m/%Y")
// @time = Time.new(time.year, time.month, time.day)
// end
// end