var setToChannel;
module.exports = {
  name: 'welcomechannel',
  description: 'Sets a new welcome channel for this server. (Admin only)',
  usage: ['[channel]'],
  cooldown: 30,
  category: "admin",
  updatedb: true,
  needsadmin: true,
  guildOnly: true,
  needsdb: true,
  async execute(message, args, dbInstance) {
    if (args.length) {
      setToChannel = message.mentions.channels.first().id;
      var myquery = { name: "settings" };
      var newvalue = { $set: { welcomechannel: setToChannel } };
      dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
        if (err) throw err;
        message.channel.send(`Successfully set channel to ${message.mentions.channels.first()}`);
      });
    } else {
      dbInstance.collection("config").findOne({}, async function (err, result) {
        if (err) throw err;
        message.channel.send(`Welcome channel is ${await message.guild.channels.cache.get(result.welcomechannel).toString()}`);
      });
    }
  },
};