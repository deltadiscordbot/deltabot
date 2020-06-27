const Discord = require('discord.js');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    category: "owner",
    async execute(message, args) {
console.log(message.client)       
    },
};