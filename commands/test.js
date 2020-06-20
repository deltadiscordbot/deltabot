const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    needsclient: true,
    category: "owner",
    async execute(message, args, client) {
        sendChannel = client.channels.cache.get(args[0].toString());
        sendChannel.send(args.join(" "));
       
    },
};