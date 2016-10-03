const options    = require('./const/options');
const chatUtils = require('./functions/chat_utils');
const Ui         = require('./models/ui');

var chat = chatUtils.createChat(options);
var ui   = new Ui(chat);

ui.open();
