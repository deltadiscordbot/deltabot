const package = require('../package.json');
const Discord = require('discord.js');
var currentModRoles;
var currentRole;
module.exports = {
  name: 'listmods',
  description: `List current server mods. (Mod only)`,
  cooldown: 10,
  updatedb: true,
  needsmod: true,
  guildOnly: true,

  async execute(message, args) {
    if (message.guild.id == "625766896230334465") {
      var data = '';
      const items = await message.client.dbInstance.collection('config').findOne({});
      currentModRoles = items.modroles;
      currentModRoles.forEach(element => {
        currentRole = message.guild.roles.cache.get(element);
        data += `${currentRole.members.map(m => m.user)} - ${currentRole}\n`;
      });
      const modEmbed = new Discord.MessageEmbed()
        .setColor('#32CD32')
        .setTitle("Current mods:")
        .setDescription(data)
        .setTimestamp()
        .setFooter(package.name + ' v. ' + package.version);
      message.channel.send(modEmbed);
      return;
    } else {
      message.reply("you need to use this command in the AltStore Discord server.")
    }
  },
};