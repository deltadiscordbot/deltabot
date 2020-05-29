const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    needsclient: true,
    execute(message, args, client) {
        MongoClient.connect(mongodbase, function(err, db) {
            if (err) throw err;
			dbInstance = db.db(currentdb);
            dbInstance.collection("users").find({}).toArray(function(err, result) {
              if (err) throw err;
                result.forEach(element => {
                    color = "#000000";
					const myobj = { id: element.id };
					const newvalues = { $set: {color: color} };
					dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
						if (err) throw err;
						message.reply(`fixed ${result.length} accounts.`)
					});
                });
              db.close();
            });
          });
          

    },
};