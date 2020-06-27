var setToChannel;
var currentAnnounceChannels;
module.exports = {
  name: 'announcechannel',
  description: 'Sets a new announcement channel for this server. (Admin only)',
  usage: ['[channel]'],
  cooldown: 30,
  category: "admin",
  updatedb: true,
  needsdb: true,
  needsadmin: true,
  guildOnly: true,
  async execute(message, args, dbInstance) {
    if (args.length) {
      setToChannel = message.mentions.channels.first().id;
      const items = await dbInstance.collection('config').findOne({});
      currentAnnounceChannels = items.announcechannel;
      if (currentAnnounceChannels.includes(setToChannel)) {
        currentAnnounceChannels.splice(currentAnnounceChannels.indexOf(setToChannel), 1);
        var myquery = { name: "settings" };
        var newvalue = { $set: { announcechannel: currentAnnounceChannels } };
        dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
          if (err) throw err;
          message.channel.send(`Successfully removed channel ${message.mentions.channels.first()}`);
          return;
        });
      } else {
        currentAnnounceChannels.push(setToChannel);
        var myquery = { name: "settings" };
        var newvalue = { $set: { announcechannel: currentAnnounceChannels } };
        dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
          if (err) throw err;
          message.channel.send(`Successfully added channel ${message.mentions.channels.first()}`);
          return;
        });
      }
    }
  },
};