const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    needsclient: true,
    execute(message, args, client) {
        const test = new Discord.MessageEmbed()
            .setDescription(":banana:");
        message.channel.send(test)

    },
};