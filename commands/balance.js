var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
	name: 'balance',
	description: 'Gets credits balance.',
	guildOnly: true,
	category: "eco",
	aliases: ['bal'],
	execute(message, args) {
		MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
			if (err) throw err;
			dbInstance = db.db(currentdb);
			const client = message.client;
			let userObject;
			if (args.length) {
				if (message.mentions.users.size) {
					userObject = message.mentions.users.first()
				} else if (client.users.cache.find(user => user.id === args[0].toString())) {
					userObject = client.users.cache.find(user => user.id === args[0].toString())
				} else if (client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())) {
					userObject = client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())
				} else {
					userObject = message.author
				}
			} else {
				userObject = message.author
			}
			const user = await dbInstance.collection("users").findOne({ id: userObject.id });
			if (user == null) {
				message.reply(`${userObject.tag} does not have an account. Do \`!daily\` to make one.`)
				db.close();
			} else {
				message.reply(`${userObject.tag} has ${user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} credits.`)
			}
			db.close();
		});
	},
};