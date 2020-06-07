const Discord = require('discord.js');
var screenshot = require("node-server-screenshot");
const fs = require('fs');
module.exports = {
	name: 'devstatus',
	description: 'Checks Apples services.',
	aliases: ['ds'],
	cooldown: 30,
	execute(message, args) {
		message.channel.send("Fetching status... <a:loading:718190657579253782>")
			.then(msg => {
				screenshot.fromURL("https://developer.apple.com/system-status/", "dstatus.jpeg", { width: 2560, height: 1440, scale: 1.95, clip: { x: 160, y: 80, width: 1000, height: 700 } }, function () {
					msg.edit("https://developer.apple.com/system-status/");
					message.channel.send({ files: ["dstatus.jpeg"] });
					setTimeout(() => {
						try {
							fs.unlinkSync("dstatus.jpeg")
						} catch (err) {
							console.error(err)
						}
					}, 5000);
				});
			})
	},
};