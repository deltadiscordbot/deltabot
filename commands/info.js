const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'info',
    description: `Gives information about ${package.name}.`,
    guildOnly: true,
    aliases: ['stats'],
    cooldown: 10,
    needsclient: true,
    execute(message, args, client) {
    const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#32CD32')
    .setTitle(package.name)
    .setURL("https://github.com/deltadiscordbot/deltabot")
    .setThumbnail(client.user.avatarURL)
	.setDescription(package.description)
    .addField('Servers:', client.guilds.cache.size,true)
    .addField('Users:', client.users.cache.size,true)
    .addField('Version:', package.version)
	.addField('Library:','discord.js',true)
	.addField('Creator:', package.author,true)
	.setTimestamp()
	.setFooter('Requested by: ' + message.author.tag);

    message.channel.send(exampleEmbed);
    },
};