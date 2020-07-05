const ytdl = require('ytdl-core');
module.exports = {
    name: 'resume',
    description: 'Resumes playing music.',
    category: "music",
    guildOnly: true,
    cooldown: 10,
    needsqueue: true,
    async execute(message, args, queue) {
        serverQueue = queue.get(message.guild.id);
        if (!message.member.voice.channel)
            return message.channel.send(
                "You have to be in a voice channel to resume the music!"
            );
        if (!serverQueue)
            return message.channel.send("No music is playing!");
        serverQueue.connection.dispatcher.resume();
        message.channel.send("Music resumed! :play_pause:");
    },
};