var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const package = require('../package.json');
var dbInstance;
var currentModRoles;
var modRoleAdding;
module.exports = {
  name: 'addmodrole',
  description: `Adds a role as a moderator for ${package.name} (Admin only)`,
  usage: ['[role]'],
  cooldown: 10,
  updatedb: true,
  needsadmin: true,
  args: true,
  guildOnly: true,
  execute(message, args) {
    MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
      if (err) throw err;
      modRoleAdding = args[0];
      dbInstance = db.db(currentdb);
      const items = await dbInstance.collection('config').findOne({});
      currentModRoles = items.modroles;
      if (currentModRoles.includes(modRoleAdding)) {
        message.channel.send(`That role already has mod. Use ${items.prefix}removemodrole to remove it.`);
        return;
      } else {
        currentModRoles.push(modRoleAdding);

        var myquery = { name: "settings" };
        var newvalue = { $set: { modroles: currentModRoles } };
        dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
          if (err) throw err;
          message.channel.send(`Successfully added ${message.guild.roles.cache.get(modRoleAdding)} as a mod role.`);
          db.close();
        });
      }
    });

  },
};