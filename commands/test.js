const Discord = require('discord.js');
const { projectId } = require('../config.json');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    category: "owner",
    needsqueue: true,
    async execute(message, args, queue) {
        const date = new Date("2020-01-08T17:00:00-07:00");
        var changedDate = date.getMonth() + 1;
        changedDate += `/${date.getDate()}`
        message.reply(changedDate)

    }
}