const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'test',
    description: `Used for internal testing.`,
    guildOnly: true,
    cooldown: 10,
    needsclient: true,
    needsowner:true,
    execute(message, args, client) {
        message.reply(client.channels.cache.get(args[0]));
},
};