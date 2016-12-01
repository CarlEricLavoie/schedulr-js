var Activity = require('./activity');
var LogEntry = require('./LogEntry');
var Calendar = require('./Calendar');
var fs = require('fs');
var os = require('os');

function Schedulr() {
	this.instanceName = 'default.timesheet';
	this.activites = [];
	this.latestTimestamp = null;
	this.timerRunning = false;
	this.currentActivity = null;
	this.calendar = new Calendar();
};

/**
 * Loads a schedulr instance from persistence
 * @param name
 * @returns {Schedulr}
 */
Schedulr.prototype.load = function (name) {
	name=name?name:'default';
	this.instanceName = `${name}.timesheet`;
	var self = this;
	fs.exists(self.instanceName, function(exists) {
		if (exists) {
			var lineReader = require('readline').createInterface({
				input: require('fs').createReadStream(self.instanceName)
			});

			lineReader.on('line', function (line) {
				LogEntry.exec.call(this, LogEntry.from(line));
			}.bind(self));
		}
	});

	return this;
};

/**
 * Wraps the ${funcName} with the save strategy so that it is persistence when called.
 * @param funcName
 */
Schedulr.addPersistenceFunction = function (funcName) {
	if (typeof Schedulr.prototype[funcName] !== 'function') return;

	var origFunc = Schedulr.prototype[funcName];

	Schedulr.prototype[funcName] = function() {
		var args = Array.from(arguments);
		if (typeof args[origFunc.length] !== 'undefined') {
			var save = args[origFunc.length];
			args.pop();
			if(save){
				args.push(false);
				this.save(funcName, args);
			}
		}else{
			args.push(false);
			this.save(funcName, args);
		}
		origFunc.apply(this, args);
	}
};

/**
 * Applies addPersistenceFunction on a list of function names if that function exists
 * @param funcNames
 */
Schedulr.addPersistenceFunctions = function(funcNames){
	funcNames.filter(funcName => Schedulr.prototype.hasOwnProperty(funcName)).map(this.addPersistenceFunction);
};


/**
 * Rename an activity
 * @param oldActivityName
 * @param newActivityName
 * @returns {boolean}
 */
Schedulr.prototype.rename = function (oldActivityName, newActivityName) {
	var activity = this.activites.get(oldActivityName);
	if(!activity) return false;
	activity.name = newActivityName;
};

/**
 * Persists a function call and its parameters
 * @param functionName
 * @param args
 */
Schedulr.prototype.save = function (functionName, args) {
	var logEntry = new LogEntry(Date.now(), functionName, args);
	fs.appendFile(this.instanceName, `${logEntry.toLog()}${os.EOL}`, function(err){
	});
};

/**
 * Add an activity by name. No duplicate allowed.
 * @param activityName
 */
Schedulr.prototype.add = function (activityName){
	if (this.get(activityName)) return;
	this.activites.push(new Activity(activityName));
};

/**
 * Returns the list of activities
 * @returns {Array|*}
 */
Schedulr.prototype.list = function () {
	return this.activites;
};

/**
 * Remove an activity by name
 * @param activityName
 */
Schedulr.prototype.remove = function (activityName) {
	this.activites = this.activites.filter(activity => activity.name !== activityName);
	this.currentActivity = null;
};

/**
 * Get an activity by name
 * @param activityName
 * @returns {Activity}
 */
Schedulr.prototype.get = function (activityName) {
	return this.activites.find(activity => activity.name === activityName);
};

/**
 * Stops the timer
 */
Schedulr.prototype.stop = function(){
	if(this.timerRunning){
		this.computeTime();
	}
	this.timerRunning = false;
};

/**
 * Starts the timer
 */
Schedulr.prototype.start = function(){
	if(this.currentActivity){
		this.timerRunning = true;
	}
	this.latestTimestamp = Date.now();
};

/**
 * Returns the current activity that is being worked on.
 * @returns {null|*}
 */
Schedulr.prototype.current = function(){
	return this.currentActivity;
};

/**
 * Sets the current activity that is being worked on.
 * @param activityName
 */
Schedulr.prototype.set = function(activityName){
	this.computeTime();
	this.currentActivity = this.get(activityName);
};

/**
 * Returns all activities for current day. The offset is a number of day by which the search will be offset.
 * @param offset
 */
Schedulr.prototype.day = function(offset){
	offset=offset?parseInt(offset):0;
	var tempCalendar = this.computeTimeTemporarly();
	var today = new Date(Date.now());
	//Todo : offset as timestamp
	today.setDate(today.getDate() - offset);
	return tempCalendar.getDay(today.valueOf());
};

/**
 * Used to compute the time to create events and add them to the proper day.
 */
Schedulr.prototype.computeTime = function(){
	if(!this.latestTimestamp){
		this.latestTimestamp = Date.now();
	}
	this.calendar.addEvent(this.latestTimestamp, Date.now(), this.currentActivity);
	this.latestTimestamp = Date.now();
};

/**
 * Used to compute time without actually updating the calendar, such as when displaying daily schedule.
 */
Schedulr.prototype.computeTimeTemporarly = function () {
	var tempCalendar = this.calendar.copy();
	tempCalendar.addEvent(this.latestTimestamp, Date.now(), this.currentActivity);
	return tempCalendar;
}

//List of functions that need to be persisted.
Schedulr.addPersistenceFunctions(['add', 'start', 'stop', 'remove', 'rename', 'set']);


module.exports = Schedulr;