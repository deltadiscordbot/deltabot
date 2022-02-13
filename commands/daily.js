module.exports = {
	name: 'daily',
	description: 'Gets daily credits.',
	aliases: ['redeem'],
	guildOnly: true,

	category: "eco",
	async execute(message, args) {
		const user = await message.client.dbInstance.collection("users").findOne({ id: message.author.id });
		if (user == null) {
			const dateNow = new Date();
			var myobj = { id: message.author.id, name: message.author.tag, balance: 1000, dailytime: dateNow.setUTCHours(0, 0, 0, 0), totalCredits: 1000, color: "#000000", slotsPlays: 0, blackjackPlays: 0, lastWin: 0 };
			message.client.dbInstance.collection("users").insertOne(myobj, function (err, res) {
				if (err) throw err;
				message.reply(`account created. \`1,000\` credits were added to your balance.`)
			});
		} else {
			const two = user.dailytime
			const dateNow = new Date();
			// var millisecondsPerDay = 43_200_000; // remove ms checking in favour for day checking (avoids having to wait exactly 24h)
			// var millisBetween = dateNow - two;
			var date = dateNow.setUTCHours(0, 0, 0, 0); // check time - hours avoids issues with redeeming on the same day in a later month or year
			if (date != two) {
				let newbalance = user.balance + 1000;
				let newTotal = user.totalCredits + 1000;
				const myobj = { id: message.author.id };
				const newvalues = { $set: { name: message.author.tag, balance: newbalance, dailytime: dateNow.setUTCHours(0, 0, 0, 0), totalCredits: newTotal } };
				message.client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
					if (err) throw err;
					message.reply(`\`1,000\` daily credits redeemed. Your new balance is \`${newbalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\`.`)
				});
			} else {
				message.reply(`you need to wait until tomorrow before collecting your daily credits.`)
			}
		}
	},
};
