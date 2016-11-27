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
		// console.log(`ran command ${event.cmd} with args ${JSON.stringify(event.args)} from log`);
		var _dateNow = Date.now;
		Date.now = () => event.date;
		this[event.cmd].apply(this, event.args);
		Date.now = _dateNow;
		// this[event.cmd].apply(this, event.args);
	}
};

LogEntry.from = function (line) {
	var logEntry = JSON.parse(line);
	return new LogEntry(logEntry.date, logEntry.cmd, logEntry.args);
};

module.exports = LogEntry;


// class LogEntry
// attr_accessor :date
// attr_accessor :cmd
// attr_accessor :args
//
// def to_log()
// "{{#{@date.to_i}}}{{#{@cmd}}}{{#{@args}}}"
// end
//
// def initialize(date, cmd, args)
// @date = date
// @cmd = cmd
// @args = args
// end
//
// end
//
// def LogEntry.from(line)
// data = line.scan(/\{\{(.*?)\}\}+/)
// date = Time.at(data[0][0].to_i)
// cmd = data[1][0]
// args = data[2][0].gsub(/(\[\"?|\"?\])/, '').split(/"?, "?/)
// LogEntry.new(date, cmd, args)
// end
