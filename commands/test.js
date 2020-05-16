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
        const modEmbed = new Discord.MessageEmbed()
        .setColor('#018084')
        .setTitle("New AltStore Alpha update!")
        .addField("Add source:","https://www.google.com")
        .setTimestamp()
        .setFooter(package.name + ' v. ' + package.version);
        
            message.channel.send(modEmbed);
},
};