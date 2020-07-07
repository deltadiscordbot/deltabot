const Discord = require('discord.js');
module.exports = {
  name: 'fix',
  description: 'Used for internal testing. (Owner only)',
  needsowner: true,

  cooldown: 1,
  category: "owner",
  async execute(message, args) {
    message.client.dbInstance.collection("users").find({}).toArray(function (err, result) {
      if (err) throw err;
      result.forEach(element => {
        dailytime = new Date("2020-05-20T01:47:55.057+00:00");
        const myobj = { id: element.id };
        const newvalues = { $set: { dailytime: dailytime } };
        message.client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
          if (err) throw err;
        });
      });
      message.reply(`fixed ${result.length} accounts.`)
    });
  },
};