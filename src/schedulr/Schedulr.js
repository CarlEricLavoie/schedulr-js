var Activity = require('./activity');
// LogEntry = require('./LogEntry');
var Calendar = require('./Calendar');
var fs = require('fs');

function Schedulr() {
	this.dateNow = Date.now();
	this.instanceName = null;
	this.activites = [];
	this.latestTimestamp = null;
	this.timerRunning = false;
	this.currentActivity = null;
	this.calendar = new Calendar();
};

Schedulr.prototype.load = function (name) {
	this.initialize();
	this.instanceName = `${name}.timesheet`;
	console.log('TODO::Read from file');
	// open(@instance_name, 'a+') do |f|
	// f.each_line do |line|
	// load_line(line)
};

Schedulr.prototype.loadLine = function (line) {
	var log = LogEntry.from(line);
	this.dateNow = log.date;
	console.log('exec script');
};

Schedulr.addPersistenceFunction = function (funcName) {
	if (typeof Schedulr.prototype[funcName] !== 'function') return;

	var origFunc = Schedulr.prototype[funcName];

	Schedulr.prototype[funcName] = function() {

		if (typeof arguments[origFunc.length] !== 'undefined') {
			var save = arguments[origFunc.length];
			arguments.pop();
			if(save){
				this.save(funcName, arguments);
			}
		}else{
			this.save(funcName, arguments);
		}
		origFunc.apply(this, arguments);
	}
};
Schedulr.addPersistenceFunctions = function(funcNames){
	funcNames.filter(funcName => Schedulr.prototype.hasOwnProperty(funcName)).map(this.addPersistenceFunction);
};

Schedulr.prototype.rename = function (oldActivityName, newActivityName) {
	var activity = this.activites.get(oldActivityName);
	if(!activity) return false;
	activity.name = newActivityName;
};

Schedulr.prototype.save = function (functionName, args) {
	console.log(`called save for ${functionName} with arguments ${JSON.stringify(args)}`);
	fs.open('test.txt','w', function(file){
		file.write('test');
	});
};

Schedulr.prototype.add = function (activityName){
	if (this.get(activityName)) return;
	this.activites.push(new Activity(activityName));
};

Schedulr.prototype.list = function () {
	return this.activites;
};

Schedulr.prototype.remove = function (activityName) {
	this.activites = this.activites.filter(activity => activity.name !== activityName);
	this.currentActivity = null;
};

Schedulr.prototype.get = function (activityName) {
	return this.activites.find(activity => activity.name === activityName);
};

Schedulr.prototype.stop = function(){
	this.timerRunning = false;
};

Schedulr.prototype.start = function(){
	this.timerRunning = true;
};

Schedulr.prototype.current = function(){
	return this.currentActivity;
};

Schedulr.prototype.set = function(activityName){
	this.currentActivity = this.get(activityName);
};


Schedulr.addPersistenceFunctions(['add', 'start', 'stop', 'remove', 'rename']);
module.exports = Schedulr;


// def self.load_line(line)
// log = LogEntry.from(line)
// @time_now = log.date
// send(log.cmd, *log.args, false)
// end
//
// def self.rename(activity_id, activity_name, save = true)
// activity_id = activity_id.to_i
//
// save ("rename", [activity_id, activity_name]) if save
// 	activity = @activities.find do |activity|
// activity.id == activity_id
// end
// activity.name = activity_name
// end
//
// def self.save(command, args)
// log_entry = LogEntry.new(Time.now.to_i, command, args)
// open(@instance_name, 'a') do |f|
// f.puts log_entry.to_log
// end
// end
//
// def self.add(activity, save = true)
// save ("add", [activity]) if save
// 	activity = Activity.new(activity)
// @activities << activity
// return activity
// end
//
// def self.list()
// @activities
// end
//
// def self.day(offset = 0)
// @time_now = Time.now
// stop(false) if @timer_running
// 	now = Time.now
// d_end = Time.new(now.year, now.month, now.day)
// d_end = d_end - (1*24*60*60*offset.to_i)
// @calendar.day_of(d_end)
// end
//
// def self.get (activity_id)
// activity_id = activity_id.to_i
// @activities.find do |activity|
// activity.id == activity_id
// end
// end
//
// def self.computeTime()
// if !@current_activity.nil?
// 	@calendar.event(Time.at(@latest_timestamp), @time_now, @current_activity)
// 	end
// @latest_timestamp = @time_now
// end
//
// #Adds an event to the right day
//
//
// def self.start(save = true)
// save("start", []) if save
// @timer_running = true if !@current_activity.nil?
// 	@latest_timestamp = @time_now
// 	end
//
// 	def self.stop(save = true)
// save("stop", []) if save
// 	computeTime() if @timer_running
// @timer_running = false
// end
//
// def self.current()
// @current_activity
// end
//
// def self.set (activity_id, save = true)
// save("set", [activity_id]) if save
// 	computeTime()
// @current_activity = get(activity_id)
// end
//
// def self.remove(activity_id, save = true)
// activity_id = activity_id.to_i
//
// save ("remove", [activity_id]) if save
// @activities.delete_if do |activity|
// activity.id == activity_id
// end
// end
// end
