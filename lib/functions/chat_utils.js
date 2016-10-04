const Chat = require('chat');
const RC4  = require('rc4-stream');
const SDes = require('sdes');
const Dh = require('dh');
const child_process = require('child_process');
const Buffer = require('buffer').Buffer;
const DateCypher = require('date_cypher');
const entrepixels = `${__dirname}/../../bin/entrepixels`;
const gritoDoIpirangaImage = `${__dirname}/../../res/gritodoipiranga.bmp`;
const gritoDoIpirangeDate = '07/09/1822';

const createChat = function (options) {
  var chat = new Chat({ host: options.host, port: options.port });
  var dh = new Dh({ host: options.host, port: Number(options.port) + 1});
  chat.options = {};
  chat.dh = dh;

  dh.on('secret', function (secret) {
    if (chat.options.key != secret) {
        chat.options.key = secret;

        setCryptorLayer(chat);
        chat.options.negotiating_dh = false;
    }
  });

  if(options.remote_host || options.remote_port)
    chat.connect({ host: options.remote_host || 'localhost', port: options.remote_port || 3355 });

  console.log('Server created ' + options.host + ':' + options.port);
  console.log('Diffie-Hellman server listening on ' + options.host + ':' + (Number(options.port) + 1));

  updateChat(chat, options);
  return chat;
};

const updateChat = function (chat, options) {
    chat.options.remote_host = options.remote_host || chat.options.remote_host;
    chat.options.remote_port = options.remote_port || chat.options.remote_port;

    if (!chat.options.negotiating_dh && (options.diffie_hellman || String(options.key).match(/dh/i))) {
        chat.options.negotiating_dh = true;
        chat.options.crypto = options.crypto || chat.options.crypto;
        
        var remote_address = chat.options.remote_host || chat.socket.remoteAddress || 'localhost';
        var remote_port    = (Number(chat.options.remote_port) || 3355) + 1;
       
        chat.dh.negotiateSecret({host:  remote_address, port:  remote_port});
        return;
    }  
    
    if (options.crypto && options.crypto != chat.options.crypto ||
        options.key    && options.key    != chat.options.key) {

        chat.options.crypto = options.crypto || chat.options.crypto;
        chat.options.key    = normalizeKey(options.key) || chat.options.key;

        setCryptorLayer(chat);
    }

    if (options.export_key && chat.options.key) {
      var message = DateCypher.cypher(chat.options.key, gritoDoIpirangeDate).toString('base64');
      child_process.execFile(
        entrepixels,
        ['hide', '-m', message, '-i', gritoDoIpirangaImage,'-o', options.export_key],
        function(err, stdout, stderr) {
          if(err) {
            console.log(stderr);
          } else {
            console.log("Exported key " + chat.options.key.toString('hex') + " to " + options.export_key);
          }
        }
      )
    }

    if (options.import_key) {
        child_process.execFile(entrepixels, ['show', '-i', options.import_key], function(error, stdout){
            var key = DateCypher.decipher(stdout, gritoDoIpirangeDate, 'base64');
            if (key != chat.options.key) {
                chat.options.key = key;
                setCryptorLayer(chat);
            }
        });
    }
};

function setCryptorLayer(chat) {
    var options = chat.options;
    if (!(options.crypto && options.key)) {
        // TODO: Remove cryptor layer
        return;
    }

    var cipher, decipher;
    if (String(options.crypto).match(/sdes/i)) {
        console.log("Change crypto layer to SDES with key \n" + options.key.toString('hex'));
        cipher = SDes.SDesStreamEncrypt;
        decipher = SDes.SDesStreamDecrypt;
    } else if (String(options.crypto).match(/rc4/i)) {
        console.log("Change crypto layer to RC4 with key \n" + options.key.toString('hex'));
        cipher = decipher = RC4;
    }
    chat.setCryptoLayer(cipher({key: options.key}), decipher({key: options.key}));
}

function normalizeKey(key) {
    if (!key) return;
    if (typeof key !== 'string' && !(key instanceof Buffer)) {
        key = key.toString();
    }
    if (typeof key === 'string') {
        key = Buffer.from(key);
    }
    return key;
}

module.exports = {createChat, updateChat};
