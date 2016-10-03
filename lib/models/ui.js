const util = require('util');

var Ui = function(chat) {
  this.chat = chat;
}

Ui.prototype.open = function() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function (text) {
    this.chat.write(util.inspect(text));
  }.bind(this));
}

Ui.prototype.close = function() {};

module.exports = Ui;
