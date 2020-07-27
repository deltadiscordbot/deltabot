const package = require('../package.json');
module.exports = {
    name: 'uptime',
    description: `Uptime of ${package.name}.`,
    cooldown: 10,
    aliases: ['up'],
    execute(message, args) {
        let totalSeconds = (message.client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        const formattedHours = ("0" + hours).slice(-2);
        const formattedMinutes = ("0" + minutes).slice(-2);
        const formattedSeconds = ("0" + seconds).slice(-2);

        const uptime = `${Math.abs(days) >= 1 ? `${days} ${Math.abs(days) == 1 ? `day` : "days"},` : ""} ${(Math.abs(formattedHours) || Math.abs(days)) >= 1 ? `${formattedHours} ${Math.abs(formattedHours) == 1 ? `hour` : "hours"},` : ""} ${Math.abs(formattedMinutes) == 1 ? `${formattedMinutes} minute` : `${formattedMinutes} minutes`}, ${Math.abs(formattedSeconds) == 1 ? `${formattedSeconds} second` : `${formattedSeconds} seconds`}`;
        message.reply(uptime)
    },
};