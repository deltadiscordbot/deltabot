const Discord = require('discord.js');
module.exports = {
	name: 'addsource',
	description: 'Adds a source listing. (Mod only)',
	needsmod: true,
	category: "mod",
	args: true,
	execute(message, args) {
		message.delete();
		const url = args.shift();
		const directInstall = new Discord.MessageEmbed()
			.setDescription(`[${args.join(" ")}](https://delta-skins.github.io/sourceinstall.html?altstore://source?url=${url})`)
			.setFooter(`Click to add`)
		message.channel.send(directInstall)
	},
};