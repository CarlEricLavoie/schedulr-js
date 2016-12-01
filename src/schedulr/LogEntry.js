function LogEntry(date, cmd, args) {
	this.cmd = cmd;
	this.date = date;
	this.args = args;
};


LogEntry.prototype.toLog = function () {
	return JSON.stringify({
		date: this.date,
		cmd: this.cmd,
		args: this.args
	});
};
LogEntry.exec = function (event) {
	if (typeof this[event.cmd] === 'function') {
		var _dateNow = Date.now;
		Date.now = () => event.date;
		this[event.cmd].apply(this, event.args);
		Date.now = _dateNow;
	}
};

LogEntry.from = function (line) {
	var logEntry = JSON.parse(line);
	return new LogEntry(logEntry.date, logEntry.cmd, logEntry.args);
};

module.exports = LogEntry;