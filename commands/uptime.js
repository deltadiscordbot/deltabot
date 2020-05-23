const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'uptime',
    description: `Uptime of ${package.name}.`,
    cooldown: 10,
    aliases: ['up'],
    needsclient: true,
    execute(message, args, client) {
        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        const formattedHours = ("0" + hours).slice(-2);
        const formattedMinutes = ("0" + minutes).slice(-2);
        const formattedSeconds = ("0" + seconds).slice(-2);

        const uptime = `${days}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        message.reply(uptime)
    },
};