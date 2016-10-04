const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'port', alias: 'p', type: Number, defaultValue: 3355 },
  { name: 'host', alias: 'h', type: String, defaultValue: '127.0.0.1' },
  { name: 'client_port', alias: 'P', type: String },
  { name: 'client_host', alias: 'H', type: String },
  { name: 'crypto', alias: 'c', type: String, defaultValue: 'sdes' },
  { name: 'key', alias: 'k', type: String }
];

module.exports = commandLineArgs(optionDefinitions);
