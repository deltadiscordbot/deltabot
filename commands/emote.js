const Discord = require('discord.js');
module.exports = {
	name: 'emote',
	description: 'Adds or deletes server emotes. (Mod only)',
	usage: ['(name)'],
	needsmod: true,
	category: "mod",
	async execute(message, args) {
		const attachments = await message.attachments;
		if (attachments.size > 0) {
			if (attachments.every(attachIsImage)) {
				if (formatBytes(attachments.first().size)) {
					let emoteName = attachments.first().name.substring(0, attachments.first().name.length - 4)
					if (args.length) {
						emoteName = args[0].toString();
					}
					message.guild.emojis.create(attachments.first().url, emoteName)
						.then(emoji => {
							message.reply(`Added ${emoji} to the server.`)
						})
				} else {
					message.reply("please upload images smaller than 256 KB.")
				}
			} else {
				message.reply("please only upload .png or .gif images.")
			}
		}

		function attachIsImage(msgAttach) {
			var url = msgAttach.url;
			//True if this url is a png image.
			return (url.indexOf("png", url.length - "png".length /*or 3*/) !== -1) || (url.indexOf("gif", url.length - "gif".length /*or 3*/) !== -1);
		}

		function formatBytes(bytes, decimals = 2) {
			if (bytes === 0) return '0 Bytes';

			const k = 1024;
			const dm = decimals < 0 ? 0 : decimals;
			const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

			const i = Math.floor(Math.log(bytes) / Math.log(k));
			if (sizes[i] == "KB") {
				if (parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) < 256) {
					return true
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	},
};