var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'addtag',
    description: 'Add a help tag. (Mod only)',
    usage: ['(tag name) (tag content)'],
    aliases: ['createtag'],
    cooldown: 10,
    category: "mod",
    needsmod: true,
    guildOnly: true,
    args: true,
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            var argsArray = Array.from(args);
            dbInstance = db.db(currentdb);
            var tagName = argsArray.shift();
            const items = await dbInstance.collection("tags").findOne({ name: tagName });
            if (items == null) {
                var myobj = { name: tagName.toString(), content: argsArray.join(" ") };
                dbInstance.collection("tags").insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    message.reply(`tag ${tagName} was added.`)
                    db.close();

                });
            } else {
                message.reply("there is already a tag with that name.")
            }
        });

    },
};