var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
var dbInstance;
module.exports = {
  name: 'prefix',
  description: 'Sets a new prefix for this server. (Mod only)',
  usage: ['[prefix]'],
  cooldown: 30,
  updatedb: true,
  category: "mod",
  needsmod: true,
  guildOnly: true,
  execute(message, args) {
    if (args.length) {
      MongoClient.connect(mongodbase, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        dbInstance = db.db(currentdb);
        var myquery = { name: "settings" };
        var newvalue = { $set: { prefix: args[0] } };
        dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
          if (err) throw err;
          db.close();
        });
      });
      message.channel.send(`Successfully set prefix to \`${args[0]}\``);
    } else {
      MongoClient.connect(mongodbase, { useUnifiedTopology: true }, function (err, db) {
        if (err) throw err;
        var dbInstance = db.db(currentdb);
        dbInstance.collection("config").findOne({}, async function (err, result) {
          if (err) throw err;
          message.channel.send(`Prefix is \`${await result.prefix}\``);
          db.close();
        });
      });
    }
  },
};