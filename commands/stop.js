const ytdl = require('ytdl-core');
module.exports = {
    name: 'stop',
    description: 'Stops playing music.',
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
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.channel.send(
            "Music has been stopped!"
        );
    },
};