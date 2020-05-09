var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const package = require('../package.json');
const Discord = require('discord.js');
var dbInstance;
var currentModRoles;
var currentRole;
module.exports = {
    name: 'listmods',
    description: `List current server mods. (Admin only)`,
    cooldown: 10,
    updatedb: true,
    needsadmin: true,
    guildOnly: true,
    execute(message, args) {
            MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function(err, db) {
                if (err) throw err;
                dbInstance = db.db(currentdb);
                var data = '';
                const items = await dbInstance.collection('config').findOne({});
                currentModRoles = items.modroles;
                currentModRoles.forEach(element => {
                  currentRole = message.guild.roles.get(element);
                    data += `${currentRole.members.map(m=>m.user)} - ${currentRole}\n`;
                  
                });
                const modEmbed = new Discord.MessageEmbed()
                .setColor('#32CD32')
                .setTitle("Current mods:")
                .setDescription(data)
                .setTimestamp()
                .setFooter(package.name + ' v. ' + package.version);
                  message.channel.send(modEmbed);
                  return;
          });

    },
};