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
        let totalSeconds = (message.client.uptime / 1000);
        let days = `${Math.floor(totalSeconds / 86400)}`;
        totalSeconds %= 86400;
        let hours = `${Math.floor(totalSeconds / 3600)}`;
        totalSeconds %= 3600;
        let minutes = `${Math.floor(totalSeconds / 60)}`;
        let seconds = Math.floor(totalSeconds % 60);
        console.log(hours)
        const formattedHours = ("0" + hours).slice(-2);
        const formattedMinutes = ("0" + minutes).slice(-2);
        const formattedSeconds = ("0" + seconds).slice(-2);
        console.log(`${formattedHours} + ${formattedMinutes} + ${formattedSeconds}`)
        const uptime = `${Math.abs(days) >= 1 ? `${days} ${Math.abs(days) == 1 ? `day` : "days"},` : ""} ${(Math.abs(formattedHours) || Math.abs(days)) >= 1 ? `${formattedHours} ${Math.abs(formattedHours) == 1 ? `hour` : "hours"},` : ""} ${Math.abs(formattedMinutes) == 1 ? `${formattedMinutes} minute` : `${formattedMinutes} minutes`}, ${Math.abs(formattedSeconds) == 1 ? `${formattedSeconds} second` : `${formattedSeconds} seconds`}`;

        const infoEmbed = new Discord.MessageEmbed()
            .setColor('#8A28F7')
            .setTitle(package.name)
            .setURL("https://github.com/deltadiscordbot/deltabot")
            .setThumbnail(client.user.avatarURL())
            .setDescription(package.description)
            .addField('Servers:', client.guilds.cache.size, true)
            .addField('Users:', client.users.cache.size, true)
            .addField('Version:', package.version)
            .addField('Library:', 'discord.js', true)
            .addField('Creator:', package.author, true)
            .setTimestamp()
            .setFooter(`Uptime: ${uptime}`);

        message.channel.send(infoEmbed);
    },
};