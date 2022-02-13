module.exports = {
	name: 'role',
	description: 'Gives roles.',
	guildOnly: true,
	args: true,
	usage: ['beta or alpha'],
	execute(message, args) {
		if (message.guild.id == "625766896230334465") {
			if (args[0].toString().toLowerCase() == "beta") {
				const member = message.guild.member(message.author);
				const role = message.guild.roles.cache.find(role => role.id === '716483174028410962');
				if (member.roles.cache.some(role => role.id === '716483174028410962')) {
					member.roles.remove(role);
					message.reply("beta role removed.")
				} else {
					member.roles.add(role);
					message.reply("beta role added.")
				}
			} else if (args[0].toString().toLowerCase() == "alpha") {
				const member = message.guild.member(message.author);
				const role = message.guild.roles.cache.find(role => role.id === '716483589692325900');
				if (member.roles.cache.some(role => role.id === '716483589692325900')) {
					member.roles.remove(role);
					message.reply("alpha role removed.")
				} else {
					member.roles.add(role);
					message.reply("alpha role added.")
				}
			}
		} else {
			message.reply("roles are only for the AltStore server.")
		}
	},
};