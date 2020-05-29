const { mongodbase, currentdb } = require('../config.json');
const package = require('../package.json');
const Discord = require('discord.js');
var userCreated;
var userRoles;
var username;
var userAvatar;
var userJoinedServer;
var userJoinPosition;
var userID;
var userObject;
var memberObject;
module.exports = {
  name: 'whois',
  description: `Shows information about a user`,
  cooldown: 10,
  updatedb: true,
  guildOnly: true,
  aliases: ['lookup'],
  execute(message, args) {
    if (args.length) {
      if (args[0] == "me"){
        userObject = message.author;
      } else{
        userObject = message.mentions.users.first();
      }
      memberObject = message.guild.member(userObject);
      username = userObject.tag;
      userAvatar = userObject.avatarURL();
      userCreated = userObject.createdAt.toDateString() + ", " + userObject.createdAt.toLocaleTimeString('en-US');
      userID = userObject.id;
      userJoinedServer = memberObject.joinedAt.toDateString() + ", " + memberObject.joinedAt.toLocaleTimeString('en-US');
      userRoles = memberObject.roles.cache.map(roles => roles).join(", ");
      sortedmembers = message.guild.members.cache.array().sort((a, b) => {
        a.joinedTimestamp - b.joinedTimestamp
      })

      userJoinPosition = sortedmembers.indexOf(memberObject) + 1
    } else {
      userObject = message.author;
      memberObject = message.guild.member(userObject);
      username = userObject.tag;
      userAvatar = userObject.avatarURL();
      userCreated = userObject.createdAt.toDateString() + ", " + userObject.createdAt.toLocaleTimeString('en-US');
      userID = userObject.id;
      userJoinedServer = memberObject.joinedAt.toDateString() + ", " + memberObject.joinedAt.toLocaleTimeString('en-US');
      userRoles = memberObject.roles.cache.map(roles => roles).join(", ");
      sortedmembers = message.guild.members.cache.array().sort((a, b) => {
        a.joinedTimestamp - b.joinedTimestamp
      })

      userJoinPosition = sortedmembers.indexOf(memberObject) + 1
    }
    const modEmbed = new Discord.MessageEmbed()
      .setColor('#32CD32')
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