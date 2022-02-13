const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    description: 'Get users avatar.',
    aliases: ['av'],
    cooldown: 10,
    guildOnly: true,
    execute(message, args) {
        var userAvatar;
        var user;
        var userID;
        if (args.length) {
            user = message.mentions.users.first();
            userID = user.id;
            userAvatar = user.avatarURL();
        } else {
            user = message.author;
            userID = message.author.id;
            userAvatar = message.author.avatarURL();
        }
        const modEmbed = new Discord.MessageEmbed()
            .setColor('#32CD32')
            .setTitle(user.tag)
            .setImage(userAvatar)
            .setTimestamp()
            .setFooter(`Requested by: @${message.author.tag}`);
        message.channel.send(modEmbed);
    },
};