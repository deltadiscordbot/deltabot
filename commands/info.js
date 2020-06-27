const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'info',
    description: `Gives information about ${package.name}.`,
    guildOnly: true,
    aliases: ['stats'],
    cooldown: 30,
    execute(message, args) {
        const client = message.client;
        const infoEmbed = new Discord.MessageEmbed()
            .setColor('#8A28F7')
            .setTitle(package.name)
            .setURL("https://github.com/deltadiscordbot/deltabot")
            .setThumbnail(client.user.avatarURL)
            .setDescription(package.description)
            .addField('Servers:', client.guilds.cache.size, true)
            .addField('Users:', client.users.cache.size, true)
            .addField('Version:', package.version)
            .addField('Library:', 'discord.js', true)
            .addField('Creator:', package.author, true)
            .setTimestamp()
            .setFooter('Requested by: ' + message.author.tag);

        message.channel.send(infoEmbed);
    },
};