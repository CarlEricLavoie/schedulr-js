var Schedulr = require('../../src/schedulr/Schedulr');
var Activity = require('../../src/schedulr/Activity');
var assert = require('assert');
var http = require('http');

module.exports = function () {
	this.Given(/^Schedulr is initialized$/, function() {
		this.schedulr = new Schedulr;
	});

	this.Given(/^Schedulr\-server is running$/, function (callback) {

	});

	this.When(/^I add an activity called "([^"]*)"$/, function (activityName) {
		this.schedulr.add(activityName);
	});

	this.Then(/^Schedulr should have (\d+) activit(?:y|ies)$/, function (activityCount) {
		assert.equal(this.schedulr.list().length, Number.parseInt(activityCount));
	});

	this.When(/^I remove an activity called "([^"]*)"$/, function (activityName) {
		// Write code here that turns the phrase above into concrete actions
		this.schedulr.remove(activityName);
	});

	this.When(/^I (stop|start) the timer$/, function (functionName) {
		// Write code here that turns the phrase above into concrete actions
		if(functionName === 'stop'){
			this.schedulr.stop();
		}else{
			this.schedulr.start();
		}
	});

	this.When(/^I set current activity as "([^"]*)"$/, function (activityName) {
		this.schedulr.set(activityName);
	});

	this.Then(/^Schedulr should have an activity named "([^"]*)"$/, function (activityName) {
		var activity = this.schedulr.get(activityName);
		assert(typeof activity === 'object', `activity not found ${activity}`);
		assert.equal(activity.constructor.name, "Activity", `activity has wrong constructor ${activity.constructor.name}`);
	});

	this.Then(/^The timer should (not )?be running$/, function (not) {
		not = !not;
		assert.equal(this.schedulr.timerRunning, not);
	});

	this.Then(/^The current activity should be named "([^"]*)"$/, function (activityName) {
		assert(this.schedulr.current(), 'no activity currently defined');
		assert.equal(this.schedulr.current().name, activityName, `current activity is name ${this.schedulr.current().name} expected ${activityName}`);
	});

};