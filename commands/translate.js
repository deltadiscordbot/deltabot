const { translateAPI } = require('../config.json');
const translate = require('translate');
const Discord = require('discord.js');
module.exports = {
	name: 'translate',
	description: 'Translates text to English. Uses two character langauge codes or full language name.',
	args: true,
	aliases: ['tr'],
	guildOnly: true,
	async execute(message, args) {
		if (args.length >= 2) {
			const lan = args.shift().toString();
			translate.engine = 'yandex';
			translate.key = translateAPI;
			translate.from = lan;
			translate.cache = 10;
			const translation = await translate(args.join(" "));
			const translationEmbed = new Discord.MessageEmbed()
				.addField(`Original (${lan}):`, args.join(" "))
				.addField('Translated:', translation)
				.setTimestamp()
				.setFooter('Requested by: ' + message.author.tag);
			message.channel.send(translationEmbed)
		}
	},
};