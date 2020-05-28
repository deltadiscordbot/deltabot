const Discord = require('discord.js');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    args: true,
    needsowner: true,
    needsclient:true,
    execute(message, args,client) {
        const testEmbed = new Discord.MessageEmbed()
        .addField("Direct install:",`${args[0]}`)
        message.channel.send(testEmbed)

    },
};