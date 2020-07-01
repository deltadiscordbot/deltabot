var setToChannel;
var currentSupportChannels;
module.exports = {
  name: 'supportchannel',
  description: 'Sets a new support channel for this server. (Admin only)',
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
      const items = await dbInstance.collection('config').findOne({});
      currentSupportChannels = items.supportchannels;
      if (currentSupportChannels.includes(setToChannel)) {
        currentSupportChannels.splice(currentSupportChannels.indexOf(setToChannel), 1);
        var myquery = { name: "settings" };
        var newvalue = { $set: { supportchannels: currentSupportChannels } };
        dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
          if (err) throw err;
          message.channel.send(`Successfully removed channel ${message.mentions.channels.first()}`);
          return;
        });
      } else {
        currentSupportChannels.push(setToChannel);

        var myquery = { name: "settings" };
        var newvalue = { $set: { supportchannels: currentSupportChannels } };
        dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
          if (err) throw err;
          message.channel.send(`Successfully added channel ${message.mentions.channels.first()}`);
          return;
        });
      }
    }
  },
};