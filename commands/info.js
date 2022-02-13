const package = require('../package.json');
const Discord = require('discord.js');
const pm2 = require('pm2');
module.exports = {
    name: 'info',
    description: `Gives information about ${package.name}.`,
    guildOnly: true,
    aliases: ['stats'],
    cooldown: 30,
    async execute(message, args) {
        const client = message.client;
        let totalSeconds = (message.client.uptime / 1000);
        let days = `${Math.floor(totalSeconds / 86400)}`;
        totalSeconds %= 86400;
        let hours = `${Math.floor(totalSeconds / 3600)}`;
        totalSeconds %= 3600;
        let minutes = `${Math.floor(totalSeconds / 60)}`;
        let seconds = Math.floor(totalSeconds % 60);
        const formattedHours = ("0" + hours).slice(-2);
        const formattedMinutes = ("0" + minutes).slice(-2);
        const formattedSeconds = ("0" + seconds).slice(-2);
        const uptime = `${Math.abs(days) >= 1 ? `${days} ${Math.abs(days) == 1 ? `day` : "days"},` : ""} ${(Math.abs(formattedHours) || Math.abs(days)) >= 1 ? `${formattedHours} ${Math.abs(formattedHours) == 1 ? `hour` : "hours"},` : ""} ${Math.abs(formattedMinutes) == 1 ? `${formattedMinutes} minute` : `${formattedMinutes} minutes`}, ${Math.abs(formattedSeconds) == 1 ? `${formattedSeconds} second` : `${formattedSeconds} seconds`}`;
        function formatBytes(a, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }
        let mem, cpu;
        await pm2.connect(async function (err) {
            pm2.describe('0', async function (err, list) {
                mem = await formatBytes(list[0].monit["memory"])
                cpu = await `${list[0].monit["cpu"]}%`
                const infoEmbed = new Discord.MessageEmbed()
                    .setColor('#8A28F7')
                    .setTitle(package.name)
                    .setThumbnail(client.user.avatarURL())
                    .setDescription(package.description)
                    .addField('Servers:', client.guilds.cache.size, true)
                    .addField('Users:', client.users.cache.size, true)
                    .addField('Version:', package.version, true)
                    .addField('Memory Usage:', mem, true)
                    .addField('CPU Usage:', cpu, true)
                    .addField('Library:', 'discord.js', true)
                    .addField('Creator:', package.author, true)
                    .setTimestamp()
                    .setFooter(`Uptime: ${uptime}`);

                message.channel.send(infoEmbed);

            });
        });
        pm2.disconnect()
    },
};