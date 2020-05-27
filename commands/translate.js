const {translateAPI} = require('../config.json');
const translate = require('translate');
const Discord = require('discord.js');
module.exports = {
	name: 'translate',
	description: 'Translates text from Spanish to English.',
	args: true,
	aliases: ['tr'],
    guildOnly: true,
	async execute(message, args) {
		translate.engine = 'yandex';
		translate.key = translateAPI;
		translate.from = 'es';
		translate.cache = 10;
		const translation = await translate(args.join(" "));
		const translationEmbed = new Discord.MessageEmbed()
		.addField('Original:', args.join(" "))
		.addField('Translated:', translation)
		.setTimestamp()
		.setFooter('Requested by: ' + message.author.tag);
		message.channel.send(translationEmbed)
	},
};