function LogEntry(date, cmd, args){
	this.cmd = cmd;
	this.date = date;
	this.args = args;
};


LogEntry.prototype.toLog = ()=>`{{${this.date}}}{{${this.cmd}}}{{${this.args}}}`;

LogEntry.from = function(line){
	var data = line.match(/\{\{(.*?)\}\}+/);
	var date = Date.parse(data[0]);
	var cmd = data[1];
	var args = data[2];
	return new LogEntry(date, cmd, args);
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
