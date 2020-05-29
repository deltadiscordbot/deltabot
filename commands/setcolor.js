var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'setcolor',
    description: 'Set profile color.',
    cooldown: 10,
    args: true,
    execute(message, args) {
		MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            dbInstance = db.db(currentdb);            
            const user = await dbInstance.collection("users").findOne({ id: message.author.id });
            if (user != null) {
                if(/^#[0-9A-F]{6}$/i.test(args[0].toString())){
                    const myobj = { id: message.author.id };
					const newvalues = { $set: { color: args[0].toString()} };
					dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
						if (err) throw err;
						message.reply(`new color has been set.`)
					});
                }else{
                    message.reply("please enter a valid color hex.")
                }
            } else {
                message.reply("you do not have an account. Make one with \`!daily\`.")
            }
            db.close();
        });


    },
};