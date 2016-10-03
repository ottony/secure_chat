const options    = require('./consts/options');
const createChat = require('./functions/create_chat');
const Ui         = require('./models/ui');

var chat = createChat(options);
var ui   = new Ui(chat);

ui.open();
