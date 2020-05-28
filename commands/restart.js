const pm2 = require('pm2');
module.exports = {
	name: 'restart',
	description: 'Restarts the bot. (Owner only)',
	needsowner: true,
	execute(message, args) {
		pm2.connect();
		pm2.restart("0");
		message.reply("restarting")
	},
};