const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    needsclient: true,
    async execute(message, args, client) {
        const ayy = await client.emojis.cache.find(emoji => emoji.name === "loading");
        console.log(ayy.id)
        message.channel.send(ayy)
    },
};