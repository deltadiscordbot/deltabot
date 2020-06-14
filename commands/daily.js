var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
	name: 'daily',
	description: 'Gets daily credits.',
	guildOnly: true,
	category: "eco",
	execute(message, args) {
		MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
			if (err) throw err;
			dbInstance = db.db(currentdb);
			const user = await dbInstance.collection("users").findOne({ id: message.author.id });
			if (user == null) {
				const dateNow = new Date();
				var myobj = { id: message.author.id, name: message.author.tag, balance: 1000, dailytime: dateNow, totalCredits: 1000, color: "#000000", slotsPlays: 0, blackjackPlays: 0, lastWin: 0 };
				dbInstance.collection("users").insertOne(myobj, function (err, res) {
					if (err) throw err;
					message.reply(`account created. \`1,000\` credits were added to your balance.`)
					db.close();
				});
			} else {
				const two = user.dailytime
				const dateNow = new Date();
				var millisecondsPerDay = 43_200_000;
				var millisBetween = dateNow - two;
				var days = parseInt(millisecondsPerDay - millisBetween);
				if (days = 0) {
					let newbalance = user.balance + 1000;
					let newTotal = user.totalCredits + 1000;
					const myobj = { id: message.author.id };
					const newvalues = { $set: { name: message.author.tag, balance: newbalance, dailytime: dateNow, totalCredits: newTotal } };
					dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
						if (err) throw err;
						message.reply(`\`1,000\` daily credits redeemed. Your new balance is \`${newbalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`.`)
					});
				} else {
					message.reply(`you need to wait until tomorrow before collecting your daily credits.`)
				}
				db.close();
			}
		});
	},
};
