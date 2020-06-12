var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'deltag',
    description: 'Removes a help tag. (Mod only)',
    usage: ['(tag name)'],
    aliases: ['deletetag'],
    cooldown: 10,
    needsmod: true,
    category: "mod",
    guildOnly: true,
    args: true,
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            dbInstance = db.db(currentdb);
            const items = await dbInstance.collection("tags").findOne({ name: args.toString() });
            if (items != null) {
                var myobj = { name: args.toString() };
                dbInstance.collection("tags").deleteOne(myobj, function (err, res) {
                    if (err) throw err;
                    message.reply(`tag ${args.toString()} was deleted.`)
                    db.close();

                });
            } else {
                message.reply("there is no tag with that name.")
            }
        });

    },
};