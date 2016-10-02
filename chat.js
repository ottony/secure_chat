const Chat = require('chat');
const util = require('util');
require('colors');

function logIncomingMessage(data, socket) {
    var remoteAddressSays = "[" + socket.remoteAddress + ":" + socket.remotePort + "] ";
    console.log(remoteAddressSays.bold + data.toString());
}

function logConnection(socket) {
    var remoteAddressConnected = "[" + socket.remoteAddress + ":" + socket.remotePort + "] connected";
    console.log(remoteAddressConnected.bold.green);
}

function logClose(socket) {
    var remoteAddressConnected = "[" + socket.remoteAddress + ":" + socket.remotePort + "] closed";
    console.log(remoteAddressConnected.bold.red);
}

function logBusy(socket) {
    var remoteAddressConnected = "[" + socket.remoteAddress + ":" + socket.remotePort + "] busy";
    console.log(remoteAddressConnected.bold.blue);
}

const serverPort = process.argv[2] || 3355;
const clientPort = process.argv[3];
var   chat = Chat({port: serverPort});

chat.on('connect', logConnection);
chat.on('busy', logBusy);
chat.on('close', logClose);
chat.on('data', logIncomingMessage);
console.log('Server created');

process.stdin.resume();
process.stdin.setEncoding('utf8');

if(clientPort)
  chat.connect({port: clientPort});

process.stdin.on('data', function (text) {
  chat.write(util.inspect(text));
});
