var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
	name: 'give',
	description: 'Gives credits.',
	guildOnly: true,
	category: "eco",
	args: true,
	aliases: ['pay'],
	execute(message, args) {
		if (args.length == 2) {
			if (message.mentions.users.size == 1) {
				if (message.mentions.users.first().id != message.author.id) {
					if (parseInt(args[1]) > 0) {
						MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
							if (err) throw err;
							dbInstance = db.db(currentdb);
							const user = await dbInstance.collection("users").findOne({ id: message.mentions.users.first().id });
							const owner = await dbInstance.collection("users").findOne({ id: message.author.id });
							if (owner == null) {
								message.reply("you do not have an account. You can make one by doing \`!daily\`.");
								return;
							}
							if (user == null) {
								message.reply("that user does not have an account.");
								return;
							}
							if (owner.balance > parseInt(args[1])) {
								const balance = user.balance + parseInt(args[1]);
								const ownerBalance = owner.balance - parseInt(args[1]);
								const newvalues = { $set: { balance: balance } };
								const myobj = { id: message.mentions.users.first().id };
								dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
									if (err) throw err;
								});
								const newvalues2 = { $set: { balance: ownerBalance } };
								const myobj2 = { id: message.author.id };
								dbInstance.collection("users").updateOne(myobj2, newvalues2, function (err, res) {
									if (err) throw err;
									message.reply(`${parseInt(args[1])} credit${Math.abs(args[1]) === 1 ? "" : "s"} have been added to ${message.mentions.users.first()}'s account. Your new balance is ${ownerBalance} and theirs is ${balance}.`)
								});

							} else {
								message.reply("you do not have enough credits in your account for this transfer.")
							}
						});
					} else {
						message.reply("please enter a positive number.")
					}
				} else {
					message.reply("you can't give credits to yourself.")
				}
			} else {
				message.reply("please mention one person.")
			}
		} else {
			message.reply("please enter a valid user and transfer amount.")

		}
	},
};