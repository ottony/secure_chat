const Chat = require('chat');
const RC4  = require('rc4-stream');
const SDes = require('sdes');
const Dh = require('dh');

const createChat = function (options) {
  var chat = new Chat({ host: options.host, port: options.port });
  var dh = new Dh({ host: options.host, port: options.port + 1});
  chat.options = options;
  chat.dh = dh;

  dh.on('secret', function (secret) {
    if (chat.options.key != secret) {
        chat.options.key = secret;
        setCryptorLayer(chat);
    }
  });

  if(options.client_host || options.client_port)
    chat.connect({ host: options.client_host || 'localhost', port: options.client_port || 3355 });

  console.log('Server created ' + options.host + ':' + options.port);
  console.log('Diffie-Hellman server listening on ' + options.host + ':' + options.port);

  return chat;
};

const updateChat = function (chat, options) {
    if (options.crypto != chat.options.crypto || options.key != chat.options.key) {
        chat.options.crypto = options.crypto;
        chat.options.key = options.key;
        setCryptorLayer(chat);
    }

    chat.options.client_host = options.client_host || chat.options.client_host;
    chat.options.client_port = options.client_port || chat.options.client_port;

    if (options.diffie_hellman) {
        var remote_address = chat.options.client_host || chat.socket.remoteAddress || 'localhost';
        var remote_port = chat.options.client_port + 1 || 3356;
        chat.dh.negotiateSecret({host:  remote_address, port:  remote_port});
    }
};

function setCryptorLayer(chat) {
    var options = chat.options;
    if (!(options.crypto && options.key)) {
        // TODO: Remove cryptor layer
        return;
    }

    var cipher, decipher;
    if (options.crypto.match(/sdes/i)) {
        console.log('Change crypto layer to SDES with key ' + options.key);
        cipher = SDes.SDesStreamEncrypt;
        decipher = SDes.SDesStreamDecrypt;
    } else if (options.crypto.match(/rc4/i)) {
        console.log('Change crypto layer to RC4 with key ' + Buffer.from(options.key.toString()).toString('hex'));
        cipher = decipher = RC4;
    }
    chat.setCryptoLayer(cipher({key: options.key}), decipher({key: options.key}));
}

module.exports = {createChat, updateChat};
