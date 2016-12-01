var request = require('request');
var params = require('../../src/server/server_params');
var baseUrl = `http://${params.hostname}:${params.port}`;

var handlers = function () {

	this.registerHandler('AfterFeatures', function (features, callback) {
		//Cleanup
		request.delete({
			url: `${baseUrl}/`
		}, ()=>callback());
	});
}

module.exports = handlers;