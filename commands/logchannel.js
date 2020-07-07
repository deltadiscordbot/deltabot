var setToChannel;
module.exports = {
  name: 'logchannel',
  description: 'Sets a new log channel for this server. (Admin only)',
  usage: ['[channel]'],
  cooldown: 30,
  category: "admin",
  updatedb: true,
  needsadmin: true,
  guildOnly: true,

  async execute(message, args) {
    if (args.length) {
      setToChannel = message.mentions.channels.first().id;
      var myquery = { name: "settings" };
      var newvalue = { $set: { logchannel: setToChannel } };
      message.client.dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
        if (err) throw err;
        message.channel.send(`Successfully set channel to ${message.mentions.channels.first()}`);
      });
    } else {
      message.client.dbInstance.collection("config").findOne({}, async function (err, result) {
        if (err) throw err;
        message.channel.send(`Log channel is ${await message.guild.channels.cache.get(result.logchannel).toString()}`);
      });
    }
  },
};