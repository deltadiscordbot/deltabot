const package = require('../package.json');
var currentModRoles;
var modRoleRemoving;
module.exports = {
  name: 'removemodrole',
  description: `Removes a role as a moderator for ${package.name} (Admin only)`,
  usage: ['[role]'],
  cooldown: 10,
  aliases: ['deletemodrole'],
  updatedb: true,
  guildOnly: true,
  category: "admin",
  needsadmin: true,
  args: true,
  needsdb: true,
  async execute(message, args, dbInstance) {
    modRoleRemoving = args[0];
    const items = await dbInstance.collection('config').findOne({});
    currentModRoles = items.modroles;
    if (currentModRoles.includes(modRoleRemoving)) {
      const index = currentModRoles.indexOf(modRoleRemoving);
      currentModRoles.splice(index, 1);
      var myquery = { name: "settings" };
      var newvalue = { $set: { modroles: currentModRoles } };
      dbInstance.collection("config").updateOne(myquery, newvalue, function (err, res) {
        if (err) throw err;
        message.channel.send(`Successfully removed ${message.guild.roles.cache.get(modRoleRemoving)} as a mod role.`);
      });
      return;
    } else {
      message.channel.send(`That role doesn't have mod. Use ${items.prefix}addmodrole to add it.`);
    }
  },
};