var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'edittag',
    description: 'Edits a help tag. (Helper only)',
    usage: ['(tag name) (tag content)'],
    cooldown: 10,
    aliases: ['changetag'],
    needshelper: true,
    category: "mod",
    guildOnly: true,
    args: true,
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            var argsArray = Array.from(args);
            dbInstance = db.db(currentdb);
            var tagName = argsArray.shift();
            const items = await dbInstance.collection("tags").findOne({ name: tagName });
            if (items != null) {
                var myobj = { name: tagName };
                var newvalues = { $set: { name: tagName, content: argsArray.join(" ") } };
                dbInstance.collection("tags").updateOne(myobj, newvalues, function (err, res) {
                    if (err) throw err;
                    message.reply(`tag ${tagName} was edited.`)
                    db.close();

                });
            } else {
                message.reply("there is no tag with that name.")
            }
        });

    },
};