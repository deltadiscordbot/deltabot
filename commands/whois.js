const { mongodbase, currentdb } = require('../config.json');
const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
  name: 'whois',
  description: `Shows information about a user`,
  cooldown: 10,
  updatedb: true,
  guildOnly: true,
  needsclient: true,
  aliases: ['lookup'],
  execute(message, args, client) {
    let userObject;
    if (args.length) {
      if (message.mentions.users.size) {
        userObject = message.mentions.users.first()
      } else if (client.users.cache.find(user => user.id === args[0].toString())) {
        userObject = client.users.cache.find(user => user.id === args[0].toString())
      } else if (client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())) {
        userObject = client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())
      } else {
        userObject = message.author
      }
    } else {
      userObject = message.author
    }
    const memberObject = message.guild.member(userObject);
    const username = userObject.tag;
    const userAvatar = userObject.avatarURL();
    const userCreated = userObject.createdAt.toDateString() + ", " + userObject.createdAt.toLocaleTimeString('en-US');
    const userID = userObject.id;
    const userJoinedServer = memberObject.joinedAt.toDateString() + ", " + memberObject.joinedAt.toLocaleTimeString('en-US');
    const userRoles = memberObject.roles.cache.map(roles => roles).join(", ");
    const sortedmembers = message.guild.members.cache.array();
    sortedmembers.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
    const userJoinPosition = sortedmembers.indexOf(memberObject) + 1
    const modEmbed = new Discord.MessageEmbed()
      .setColor('#8A28F7')
      .setAuthor(username)
      .setThumbnail(userAvatar)
      .addField("User created:", userCreated, true)
      .addField("Joined server:", userJoinedServer, true)
      .addField("Join position:", userJoinPosition, true)
      .addField("User roles:", userRoles)
      .setTimestamp()
      .setFooter(`ID: ${userID}`);
    message.channel.send(modEmbed);
  },
};
