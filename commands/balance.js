var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
	name: 'balance',
	description: 'Gets credits balance.',
	guildOnly: true,
	category: "eco",
	cooldown: 30,
	aliases: ['bal'],
	execute(message, args) {
		MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
			if (err) throw err;
			dbInstance = db.db(currentdb);
			const user = await dbInstance.collection("users").findOne({ id: message.author.id });
			if (user == null) {
				message.reply(`you do not have an account. Do \`!daily\` to make one.`)
				db.close();
			} else {
				message.reply(`you have ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} credits.`)
			}
			db.close();

		});
	},
};