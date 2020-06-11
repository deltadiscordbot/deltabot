const { translateAPI } = require('../config.json');
const translate = require('translate');
const Discord = require('discord.js');
module.exports = {
	name: 'translate',
	description: 'Translates text. Uses two character langauge codes or full language name.',
	args: true,
	usage:"[fromLan] [toLan] text",
	aliases: ['tr'],
	guildOnly: true,
	async execute(message, args) {
		if (args.length >= 2) {
			const lanFrom = args.shift().toString();
			const lanTo = args.shift().toString()
			translate.engine = 'yandex';
			translate.key = translateAPI;
			translate.from = lanFrom;
			translate.to = lanTo;
			translate.cache = 10;
			const translation = await translate(args.join(" "));
			const translationEmbed = new Discord.MessageEmbed()
				.addField(`Original (${lanFrom}):`, args.join(" "))
				.addField(`Translated (${lanTo}):`, translation)
				.setTimestamp()
				.setFooter('Requested by: ' + message.author.tag);
			message.channel.send(translationEmbed)
		}
	},
};