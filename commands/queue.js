const ytdl = require('ytdl-core');
const Discord = require('discord.js');
module.exports = {
    name: 'queue',
    description: 'Lists the current queue.',
    category: "music",
    guildOnly: true,
    cooldown: 10,
    needsqueue: true,
    aliases: ['q'],
    async execute(message, args2, queue) {
        serverQueue = await queue.get(message.guild.id);
        const passedTimeInMS = serverQueue.connection.dispatcher.streamTime;
        const passedTimeInMSObj = {
            seconds: Math.floor((passedTimeInMS / 1000) % 60),
            minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
            hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24)
        };
        const currentTime = formatDuration(
            passedTimeInMSObj
        );
        function formatDuration(durationObj) {
            const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${
                durationObj.minutes ? durationObj.minutes : '00'
                }:${
                (durationObj.seconds < 10)
                    ? ('0' + durationObj.seconds)
                    : (durationObj.seconds
                        ? durationObj.seconds
                        : '00')
                }`;
            return duration;
        }

        let songList = "";
        try {
            for (let index = 0; index < serverQueue.songs.length; index++) {
                songList += `${index + 1}. [${serverQueue.songs[index].title}](${serverQueue.songs[index].url}) - ${Math.abs(index) === 0 ? `**${currentTime}**/` : ""}${serverQueue.songs[index].length}\n`
            }
            const embed = new Discord.MessageEmbed()
                .setDescription(songList)
            message.channel.send(embed)
        } catch (error) {
            message.reply("there are no songs in the queue.")
        }

    },
};