const Chat = require('chat');
const RC4  = require('rc4-stream');
const Buffer = require('buffer').Buffer;

const createChat = function (options) {
  var chat = new Chat({ host: options.host, port: options.port });

  var key = Buffer.from('3GjIrMhAu9mitjHysrVqAZwb6aghoF3QCWallGkR1p9gc4kax7I8i73aZNjt4aQnNwxrfHve6iLIMAKGkpdN7mKgUlaI532BY5UAotqritVro+ezKbO/PnS90brexoY9bkCnKH1oxSlapgvgKhNjJWpa3rzSNaj/wV8Fnp7SJlhPVo7PHGBYNA/JkeQ0L7SZcqzG4ygZF8MYH3M47nGPh2o3Xw7wuxj8koRoRktPdYkSdQrvqg9w/gaE7rJkOahGUnabyTP4lwm+0YRbf0qLpzcRvV8QZqkHL5bKIRDUWJbGLDZi4tzrk6KQMOderLcCjPcDB5wnE9g6djiteIEt4w==', 'base64');

  chat.setCryptoLayer(RC4({key: key}), RC4({key: key}));

  if(options.client_host || options.client_port)
    chat.connect({ host: options.client_host || 'localhost', port: options.client_port || 3355 });

  console.log('Server created ' + options.host + ':' + options.port);

  return chat;
};

module.exports = createChat;
