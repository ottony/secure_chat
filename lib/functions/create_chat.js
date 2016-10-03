const Chat = require('chat');
const RC4  = require('rc4-stream');
const setLog = require('./chat/set_log');

const openChat = function (options) {
  var chat = new Chat({ host: options.host, port: options.port });

  setLog(chat);

  if(options.client_host || options.client_port)
    chat.connect({ host: options.client_host || 'localhost', port: options.client_port || 3355 });

  console.log('Server created ' + options.host + ':' + options.port);

  return chat;
}

module.exports = openChat;
