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

const setLog = function(chat) {
  chat.on('connect', logConnection);
  chat.on('busy', logBusy);
  chat.on('close', logClose);
  chat.on('data', logIncomingMessage);

  return chat;
}

module.exports = setLog;
