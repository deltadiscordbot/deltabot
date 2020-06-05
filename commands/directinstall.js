const Discord = require('discord.js');
module.exports = {
	name: 'directinstall',
	description: 'Links a direct install. (Owner only)',
	needsowner: true,
	aliases: ['di'],
	args: true,
	execute(message, args) {
		message.delete();
		const directInstall = new Discord.MessageEmbed()
			.setTitle("Direct Install")
			.setURL(`https://delta-skins.github.io/appinstall.html?altstore://install?url=${args[0]}`)
		message.channel.send(directInstall)
	},
};