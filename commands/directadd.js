const Discord = require('discord.js');
module.exports = {
	name: 'directadd',
	description: 'Links a direct source add. (Mod only)',
	needsmod: true,
	aliases: ['da'],
	category: "mod",
	args: true,
	execute(message, args) {
		message.delete();
		const directInstall = new Discord.MessageEmbed()
			.setTitle("Add source")
			.setURL(`https://delta-skins.github.io/sourceinstall.html?altstore://source?url=${args[0]}`)
		message.channel.send(directInstall)
	},
};