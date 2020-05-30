var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'defaultbet',
    description: 'Sets your default bet.',
    cooldown: 5,
    guildOnly: true,
    args: true,
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            dbInstance = db.db(currentdb);
            const user = await dbInstance.collection("users").findOne({ id: message.author.id });
            if (user != null) {
                let bet = 100;
                if (isNaN(args[0])||args[0]==Infinity||parseInt(args[0])<1||args[0].toString().includes(".",",")) {
                    message.reply("please set a valid bet.")
                    return;
                } else {
                    bet = parseInt(args[0].replace(",", "."));
                }
                const myobj = { id: message.author.id };
                const newvalues = { $set: { defaultBet: bet } };
                dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
                    if (err) throw err;
                    message.reply(`new default bet has been set.`)
                });
            } else {
                message.reply("you do not have an account. Make one with \`!daily\`.")
            }
            db.close();
        });


    },
};