module.exports = {
  name: 'prefix',
  description: 'Sets a new prefix for this server. (Mod only)',
  usage: ['[prefix]'],
  cooldown: 30,
  updatedb: true,
  category: "mod",
  needsmod: true,
  guildOnly: true,

  async execute(message, args) {
    if (args.length) {
      var myquery = { name: "settings" };
      var newvalue = { $set: { prefix: args[0] } };
      message.client.dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
        if (err) throw err;
      });
      message.channel.send(`Successfully set prefix to \`${args[0]}\``);
    } else {
      message.client.dbInstance.collection("config").findOne({}, async function (err, result) {
        if (err) throw err;
        message.channel.send(`Prefix is \`${await result.prefix}\``);
      });
    }
  },
};