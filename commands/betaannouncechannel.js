var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
var dbInstance;
var setToChannel;
var currentAnnounceChannels;
module.exports = {
    name: 'betaannouncechannel',
    description: 'Sets a new beta announcement channel for this server. (Admin only)',
    usage: ['[channel]'],
    cooldown: 30,
    updatedb: true,
    needsadmin: true,
    guildOnly: true,
    execute(message, args) {
        if (args.length) {
            setToChannel = message.mentions.channels.first().id;
            MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function(err, db) {
              if (err) throw err;
              dbInstance = db.db(currentdb);
              const items = await dbInstance.collection('config').findOne({});
              currentAnnounceChannels = items.betaannouncechannel;
              if(currentAnnounceChannels.includes(setToChannel)){
                currentAnnounceChannels.splice(currentAnnounceChannels.indexOf(setToChannel),1);
                var myquery = { name: "settings"};
                var newvalue = { $set: {betaannouncechannel: currentAnnounceChannels } };              
                dbInstance.collection("config").updateOne(myquery, newvalue, function(err, res) {
                  if (err) throw err;
                  message.channel.send(`Successfully removed channel ${message.mentions.channels.first()}`);
                  db.close();
                  return;
                });
            } else{
              currentAnnounceChannels.push(setToChannel);
            
              var myquery = { name: "settings"};
              var newvalue = { $set: {betaannouncechannel: currentAnnounceChannels } };              
              dbInstance.collection("config").updateOne(myquery, newvalue, function(err, res) {
                if (err) throw err;
                message.channel.send(`Successfully added channel ${message.mentions.channels.first()}`);
                db.close();
                return;
              });
            } 
          });
        } 
    },
};