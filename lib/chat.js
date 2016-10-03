const Chat = require('chat');
const util = require('util');
const _    = require('underscore');
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  { name: 'port', alias: 'p', type: String, defaultValue: '3355' },
  { name: 'host', alias: 'h', type: String, defaultValue: '127.0.0.1' },
  { name: 'client_port', alias: 'P', type: String },
  { name: 'client_host', alias: 'H', type: String }
]

require('colors');

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

const options = commandLineArgs(optionDefinitions);
var chat = Chat({ host: options.host, port: options.port });

chat.on('connect', logConnection);
chat.on('busy', logBusy);
chat.on('close', logClose);
chat.on('data', logIncomingMessage);

console.log('Server created ' + options.host + ':' + options.port);

process.stdin.resume();
process.stdin.setEncoding('utf8');

if(options.client_host || options.client_port)
  chat.connect({ host: options.client_host || 'localhost', port: options.client_port || 3355 });

process.stdin.on('data', function (text) {
  chat.write(util.inspect(text));
});
