var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
var dbInstance;
var setToChannel;
module.exports = {
  name: 'logchannel',
  description: 'Sets a new log channel for this server. (Admin only)',
  usage: ['[channel]'],
  cooldown: 30,
  updatedb: true,
  needsadmin: true,
  guildOnly: true,
  execute(message, args) {
    if (args.length) {
      setToChannel = message.mentions.channels.first().id;
      MongoClient.connect(mongodbase, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        dbInstance = db.db(currentdb);
        var myquery = { name: "settings" };
        var newvalue = { $set: { logchannel: setToChannel } };
        dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
          if (err) throw err;
          message.channel.send(`Successfully set channel to ${message.mentions.channels.first()}`);
          db.close();
        });
      });
    } else {
      MongoClient.connect(mongodbase, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbInstance = db.db(currentdb);
        dbInstance.collection("config").findOne({}, async function (err, result) {
          if (err) throw err;
          message.channel.send(`Log channel is ${await message.guild.channels.cache.get(result.logchannel).toString()}`);
          db.close();
        });
      });
    }
  },
};