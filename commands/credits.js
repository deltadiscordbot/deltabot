module.exports = {
	name: 'credits',
	description: 'Gives credits. (Owner only)',
	guildOnly: true,
	needsowner: true,

	category: "owner",
	args: true,
	async execute(message, args) {
		const user = await message.client.dbInstance.collection("users").findOne({ id: message.mentions.users.first().id });
		let balance = user.balance + parseFloat(args[1]);
		var newvalues = { $set: { balance: balance } };
		const myobj = { id: message.mentions.users.first().id };
		message.client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
			if (err) throw err;
			message.reply(`${args[1]} credits have been added to ${message.mentions.users.first()}'s account. Their new balance is ${balance}.`)
		});
	},
};