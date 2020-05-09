var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const package = require('../package.json');
var dbInstance;
var currentModRoles;
var modRoleRemoving;
module.exports = {
    name: 'removemodrole',
    description: `Removes a role as a moderator for ${package.name} (Admin only)`,
    usage: ['[role]'],
    cooldown: 10,
    updatedb: true,
    guildOnly: true,
    needsadmin: true,
    args: true,
    execute(message, args) {
            MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function(err, db) {
                if (err) throw err;
                modRoleRemoving = args[0];
                dbInstance = db.db(currentdb);
                const items = await dbInstance.collection('config').findOne({});
                currentModRoles = items.modroles;
                if(currentModRoles.includes(modRoleRemoving)){
                  const index = currentModRoles.indexOf(modRoleRemoving);
                  currentModRoles.splice(index,1);
                  var myquery = { name: "settings"};
                  var newvalue = { $set: {modroles: currentModRoles } };  
                  dbInstance.collection("config").updateOne(myquery, newvalue, function(err, res) {
                    if (err) throw err;
                    message.channel.send(`Successfully removed ${message.guild.roles.get(modRoleRemoving)} as a mod role.`);
                    db.close();
                  });
                  return;
              } else{
                message.channel.send(`That role doesn't have mod. Use ${items.prefix}addmodrole to add it.`);
              }
          }); 
    },
};