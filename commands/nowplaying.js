const ytdl = require('ytdl-core');
const Discord = require('discord.js');
module.exports = {
    name: 'nowplaying',
    description: 'Shows the currently playing song.',
    category: "music",
    guildOnly: true,
    cooldown: 10,
    needsqueue: true,
    aliases: ['np'],
    async execute(message, args, queue) {
        serverQueue = queue.get(message.guild.id);
        if (!serverQueue)
            return message.channel.send("No music is playing!");
        const video = serverQueue.songs[0];
        let description;
        if (video.duration == 'Live Stream') {
            description = 'Live Stream';
        } else {
            description = playbackBar(message, video);
        }

        const videoEmbed = new Discord.MessageEmbed()
            .setThumbnail(video.thumbnail)
            .setColor('#e9f931')
            .setTitle(video.title)
            .setDescription(description);
        message.channel.send(videoEmbed);
        return;
        function playbackBar(message, video) {
            const passedTimeInMS = serverQueue.connection.dispatcher.streamTime;
            const passedTimeInMSObj = {
                seconds: Math.floor((passedTimeInMS / 1000) % 60),
                minutes: Math.floor((passedTimeInMS / (1000 * 60)) % 60),
                hours: Math.floor((passedTimeInMS / (1000 * 60 * 60)) % 24)
            };
            const passedTimeFormatted = formatDuration(
                passedTimeInMSObj
            );

            let totalDurationInMS = 0;
            const timeSplit = video.length.split(":")
            totalDurationInMS += (timeSplit[0] * 60000) + (timeSplit[1] * 100);
            const playBackBarLocation = Math.round(
                (passedTimeInMS / totalDurationInMS) * 10
            );
            let playBack = '';
            for (let i = 1; i < 21; i++) {
                if (playBackBarLocation == 0) {
                    playBack = ':musical_note:▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
                    break;
                } else if (playBackBarLocation == 10) {
                    playBack = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬:musical_note:';
                    break;
                } else if (i == playBackBarLocation * 2) {
                    playBack = playBack + ':musical_note:';
                } else {
                    playBack = playBack + '▬';
                }
            }
            playBack = `${passedTimeFormatted}  ${playBack}  ${video.length}`;
            return playBack;
        }
        // prettier-ignore
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
    },
};