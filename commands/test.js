const Discord = require('discord.js');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    category: "owner",
    needsdb: true,
    async execute(message, args, dbInstance) {

    },
};