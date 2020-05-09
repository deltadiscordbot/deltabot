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
        if(args.length){
            user = message.mentions.users.first();
            userID = message.mentions.users.first().id;
            userAvatar = message.mentions.users.first().avatarURL();
        }else{
            user = message.author;
            userID = message.author.id;
            userAvatar = message.author.avatarURL();
        }
        const modEmbed = new Discord.MessageEmbed()
                .setColor('#32CD32')
                .setTitle(user.tag)
                .setImage(userAvatar)
                .setTimestamp()
                .setFooter(`Requested by: @${message.author.tag}`,userAvatar);
        message.channel.send(modEmbed);
    },
};