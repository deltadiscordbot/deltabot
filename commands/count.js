const Discord = require('discord.js');
const { computers, devices, versions } = require('../config.json');
module.exports = {
    name: 'count',
    description: 'Get member count of roles.',
    cooldown: 10,
    guildOnly: true,
    needsclient: true,
    execute(message, args, client) {
        let roleNameList = computers.concat(devices);
        roleNameList = roleNameList.concat(versions);
        let embedBody = '';
        for (let index = 0; index < roleNameList.length; index++) {
            let role = message.guild.roles.cache.find(x => x.name == roleNameList[index]);
            embedBody += `${role.name} - ${role.members.size}\n`
        }
        const embed = new Discord.MessageEmbed()
        .setDescription(embedBody)
        message.reply(embed);
    },
};