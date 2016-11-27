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
		// this.schedulr = new Schedulr;
	});

	this.Given(/^Schedulr\-server is running$/, function (callback) {
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
		// this.schedulr.remove(activityName);
	});

	this.When(/^I (stop|start) the timer$/, function (functionName, callback) {
		if (functionName === 'stop') {
			request.put({
				url: `${baseUrl}/timer`,
				json : { running : false }
			}, ()=>callback());
		} else {
			request.put({
				url: `${baseUrl}/timer`,
				json : { running : true }
			}, ()=>callback());
		}
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
			// console.log(` mqwenqkjne jkwqnjk enkjqwn ${body}`);
			assert(typeof activity === 'object', `activity not found ${activity}`);
			assert.equal(activity.name, activityName, `activity has wrong name ${activity.name}`);
			callback();
		});
		// var activity = this.schedulr.get(activityName);

	});

	this.Then(/^The timer should (not )?be running$/, function (not, callback) {
		not = !not;
		request.get({
			url: `${baseUrl}/timer`,
			json: true
		}, function(e,r,timer){
			assert.equal(timer, not);
			callback();
		})
	});

	this.Then(/^The current activity should be named "([^"]*)"$/, function (activityName, callback) {
		request.get({
			url : `${baseUrl}/current`,
			json: true
		}, function(e,r,activity){
			assert(activity, 'no activity currently defined');
			assert.equal(activity.name, activityName, `current activity is name ${activity.name} expected ${activityName}`);
			callback();
		});
	});

};