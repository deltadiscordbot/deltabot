const Discord = require('discord.js');
module.exports = {
  name: 'whois',
  description: `Shows information about a user`,
  cooldown: 10,
  updatedb: true,
  guildOnly: true,

  aliases: ['lookup'],
  async execute(message, args) {
    const client = message.client;
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
    sortedmembers.sort((a, b) => a.joinedAt - b.joinedAt)
    const userJoinPosition = sortedmembers.indexOf(memberObject) + 1
    let fields = [{ name: "User created:", value: userCreated, inline: true }, { name: "Joined server:", value: userJoinedServer, inline: true }, { name: "Join position:", value: userJoinPosition, inline: true }, { name: "User roles:", value: userRoles, inline: true }]
    let color = "#8A28F7";
    user = await message.client.dbInstance.collection("users").findOne({ id: userObject.id })
    if (user != null) {
      coloe = user.color;
      if (user.specialack) {
        fields.push({ name: "Special Acknowledgements", value: user.specialack })
      }
    }
    const modEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setAuthor(username)
      .setThumbnail(userAvatar)
      .addFields(fields)
      .setTimestamp()
      .setFooter(`ID: ${userID}`);
    message.channel.send(modEmbed)
  },
}
