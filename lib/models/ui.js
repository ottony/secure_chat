const util = require('util');
require('colors');

function isConfig(text) {
  return !!text.match(/^\\/);
}

function config(text) {
  var option = {};

  if(!isConfig(text))
    return option;

  var input = text.replace(/^\\|\n|\t|\r/g, '').split(/\s*=\s*/);

  option[input[0]] = input[1];

  return option;
}

var Ui = function(chat) {
  this.chat = chat;
};

Ui.prototype.open = function() {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  setOutput(this.chat);

  process.stdin.on('data', function (text) {
    if(!isConfig(text)) {
      this.chat.write(text.trim());
    } else {
      config(text);
    }
  }.bind(this));
};

Ui.prototype.close = function() {};


function logIncomingMessage(data, socket) {
  var remoteAddressSays = "[" + socket.remoteAddress + "] ";
  console.log(remoteAddressSays.bold.blue + data.toString());
}

function logConnection(socket) {
  var remoteAddressConnected = "[" + socket.remoteAddress + "] connected";
  console.log(remoteAddressConnected.bold.green);
}

function logClose(socket) {
  var remoteAddressConnected = "[" + socket.remoteAddress + "] closed";
  console.log(remoteAddressConnected.bold.red);
}

function logBusy(socket) {
  var remoteAddressConnected = "[" + socket.remoteAddress + "] busy";
  console.log(remoteAddressConnected.bold.yellow);
}

const setOutput = function(chat) {
  chat.on('connect', logConnection);
  chat.on('busy', logBusy);
  chat.on('close', logClose);
  chat.on('data', logIncomingMessage);

  return chat;
};

module.exports = Ui;