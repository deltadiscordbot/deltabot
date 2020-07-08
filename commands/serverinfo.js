const Discord = require('discord.js');
module.exports = {
  name: 'serverinfo',
  description: `Shows information about the server`,
  cooldown: 10,
  guildOnly: true,
  aliases: ['server', 'guildinfo', 'guild'],
  async execute(message, args) {
    let fields = [];
    fields.push({ name: "Owner:", value: message.guild.owner.toString().substring(0, 1024), inline: true })
    const serverCreated = message.guild.createdAt.toDateString() + ", " + message.guild.createdAt.toLocaleTimeString('en-US');
    fields.push({ name: "Created:", value: serverCreated.toString().substring(0, 1024), inline: true })
    fields.push({ name: "Region:", value: message.guild.region.toString().substring(0, 1024), inline: true })
    fields.push({ name: "Members:", value: message.guild.memberCount.toString().substring(0, 1024), inline: true })
    fields.push({ name: "Channels:", value: message.guild.channels.cache.size.toString().substring(0, 1024), inline: true })
    fields.push({ name: "Roles:", value: message.guild.roles.cache.size.toString().substring(0, 1024), inline: true })
    const serverEmoji = message.guild.emojis.cache.map(emoji => emoji);
    let currentStringLength = 0;
    let serverEmojiArray = [];
    serverEmojiArray[0] = '', serverEmojiArray[1] = '';
    for (let index = 0; index < serverEmoji.length; index++) {
      currentStringLength += serverEmoji[index].toString().length;
      if (currentStringLength >= 1000) {
        serverEmojiArray[1] += `${serverEmoji[index].toString()} `;
      } else {
        serverEmojiArray[0] += `${serverEmoji[index].toString()} `;
      }
    }
    console.log(serverEmojiArray)
    fields.push({ name: "Emoji:", value: serverEmojiArray[0].toString().substring(0, 1024), inline: false })
    if (serverEmojiArray[1].length > 0) {
      fields.push({ name: "Emoji cont.", value: serverEmojiArray[1].toString().substring(0, 1024), inline: true })
    }
    if (message.guild.id != "625766896230334465") {
      const inviteLink = await message.guild.fetchInvites()
      if (inviteLink.first() != undefined) {
        fields.push({ name: "Invite:", value: inviteLink.first().toString().substring(0, 1024), inline: true })
      }
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(message.guild.name)
      .setThumbnail(message.guild.iconURL())
      .addFields(fields)
      .setTimestamp()
      .setFooter(`Server ID: ${message.guild.id} | Requested by: ${message.author.tag}`)
    message.channel.send(embed)
  },
}
