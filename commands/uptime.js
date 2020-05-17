const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'uptime',
    description: `Uptime of ${package.name}.`,
    cooldown: 10,
    needsclient: true,
    execute(message, args, client) {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        let uptime = `${days}:${hours}:${minutes}:${seconds}`;
        message.reply(uptime)
    },
};