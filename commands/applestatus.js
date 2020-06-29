var screenshot = require("node-server-screenshot");
const fs = require('fs');
module.exports = {
	name: 'applestatus',
	description: 'Checks Apples services.',
	aliases: ['as'],
	cooldown: 30,
	execute(message, args) {
		message.channel.send("Fetching status... <a:loading:718190657579253782>")
			.then(msg => {
				screenshot.fromURL("https://www.apple.com/support/systemstatus/", "status.jpeg", { width: 2560, height: 1440, clip: { x: 170, y: 180, width: 1000, height: 700 } }, function () {
					msg.edit("https://www.apple.com/support/systemstatus/");
					message.channel.send({ files: ["status.jpeg"] });
					setTimeout(() => {
						try {
							fs.unlinkSync("status.jpeg")
						} catch (err) {
							console.error(err)
						}
					}, 5000);
				});
			})
	},
};