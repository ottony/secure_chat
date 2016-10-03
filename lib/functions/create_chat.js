const Chat = require('chat');
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

const openChat = function (options) {
  var chat = new Chat({ host: options.host, port: options.port });

  chat.on('connect', logConnection);
  chat.on('busy', logBusy);
  chat.on('close', logClose);
  chat.on('data', logIncomingMessage);

  if(options.client_host || options.client_port)
    chat.connect({ host: options.client_host || 'localhost', port: options.client_port || 3355 });

  console.log('Server created ' + options.host + ':' + options.port);

  return chat;
}

module.exports = openChat;
