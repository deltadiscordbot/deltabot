const ytdl = require('ytdl-core');
module.exports = {
    name: 'skip',
    description: 'Skips a song.',
    category: "music",
    guildOnly: true,
    cooldown: 10,
    needsqueue: true,
    async execute(message, args, queue) {
        serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to stop the music!"
            );
        if (!serverQueue)
            return message.channel.send("There is no song that I could skip!");
        serverQueue.connection.dispatcher.end();
        message.channel.send("Song skipped!");
    },
};