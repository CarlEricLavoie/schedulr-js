var Schedulr = require('../../src/schedulr/Schedulr');
var Activity = require('../../src/schedulr/Activity');
var assert = require('assert');
var request = require('request');
var params = require('../../src/server/server_params');
var baseUrl = `http://${params.hostname}:${params.port}`;

module.exports = function () {
	this.Given(/^Schedulr is initialized$/, function (callback) {
		request.put({
			url: `${baseUrl}/initialize`
		}, ()=>callback());
	});

	this.Given(/^current time of day is (\d+):(\d+)$/, function (hours, minutes, callback) {
		var now = new Date();
		now.setHours(hours, minutes, 0,0);
		var lockedDate = now.valueOf();
		Date.now = () => lockedDate;
		request.put({
			url: `${baseUrl}/mock/time`,
			json: {timestamp: Date.now()}
		}, ()=>callback());
	});


	this.When(/^I add an activity called "([^"]*)"$/, function (activityName, callback) {
		request.post({
			url: `${baseUrl}/activity`,
			json: {
				name: activityName
			}
		}, () => callback());
	});

	this.Then(/^Schedulr should have (\d+) activit(?:y|ies)$/, function (activityCount, callback) {
		request.get({
			url: `${baseUrl}/activity`,
			json: true
		}, function (e, r, body) {
			assert.equal(body.length, Number.parseInt(activityCount));
			callback();
		});
	});

	this.When(/^I remove an activity called "([^"]*)"$/, function (activityName, callback) {
		request.delete({
			url: `${baseUrl}/activity/${activityName}`
		}, ()=> callback());
	});

	this.When(/^I wait for (\d+) minutes$/, function (minutes, callback) {
		request.put({
			url: `${baseUrl}/mock/time`,
			json: {timestamp: Date.now() + 1000 * 60 * minutes}
		}, ()=>callback());

		//exit call stack before setting the Date.now again
		// setTimeout(function(){
		// 	Date.now = _dateNow;
		// },0)
	});


	this.When(/^I (stop|start) the timer$/, function (functionName, callback) {
		request.put({
			url: `${baseUrl}/timer`,
			json: {running: functionName === 'start'}
		}, ()=>callback());
	});

	this.When(/^I set current activity as "([^"]*)"$/, function (activityName, callback) {
		request.put({
			url: `${baseUrl}/current`,
			json: {name: activityName}
		}, ()=>callback())
	});

	this.Then(/^Schedulr should have an activity named "([^"]*)"$/, function (activityName, callback) {
		request.get({
			url: `${baseUrl}/activity/${activityName}`,
			json: true
		}, function (e, r, activity) {
			assert(typeof activity === 'object', `activity not found ${activity}`);
			assert.equal(activity.name, activityName, `activity has wrong name ${activity.name}`);
			callback();
		});

	});

	this.Then(/^the daily schedule activity (\d+) should have (\d+) minutes spent$/, function (activityId, minutes, callback) {
		request.get({
			url: `${baseUrl}/day`,
			json: true
		}, function (e, r, schedule) {
			assert(schedule.events[activityId]);
			assert.equal(schedule.events[activityId].endTime - schedule.events[activityId].startTime, 1000 * 60 * minutes);
			callback();
		});
	});

	this.Then(/^The timer should (not )?be running$/, function (not, callback) {
		not = !not;
		request.get({
			url: `${baseUrl}/timer`,
			json: true
		}, function (e, r, timer) {
			assert.equal(timer, not);
			callback();
		})
	});

	this.Then(/^the daily schedule(?: from (\d+) day ago)? should have (\d+) activity$/, function (offset, activityCount, callback) {
		request.get({
			url: `${baseUrl}/day/${offset || 0}`,
			json: true
		}, function (e, r, schedule) {
			if(schedule.events.length != activityCount){
				console.log(JSON.stringify(schedule.events));
			}
			assert.equal(schedule.events.length, activityCount);
			callback();
		});
	});

	this.Then(/^The current activity should be named "([^"]*)"$/, function (activityName, callback) {
		request.get({
			url: `${baseUrl}/current`,
			json: true
		}, function (e, r, activity) {
			assert(activity, 'no activity currently defined');
			assert.equal(activity.name, activityName, `current activity is name ${activity.name} expected ${activityName}`);
			callback();
		});
	});

};