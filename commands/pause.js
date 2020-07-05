const ytdl = require('ytdl-core');
module.exports = {
    name: 'pause',
    description: 'Pauses the music.',
    category: "music",
    guildOnly: true,
    cooldown: 10,
    needsqueue: true,
    async execute(message, args, queue) {
        serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to pause the music!"
            );
        if (!serverQueue)
            return message.channel.send("No music is playing!");
        serverQueue.connection.dispatcher.pause();
        message.channel.send("Music paused! :pause_button:");
    },
};