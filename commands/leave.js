module.exports = {
    name: 'leave',
    description: 'Leave a voice channel. (Mod only)',
    category: "music",
    guildOnly: true,
    cooldown: 10,
    needsqueue: true,
    needsmod: true,
    async execute(message, args2, queue) {
        serverQueue = queue.get(message.guild.id);
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.member.voice.channel.leave();
        message.channel.send(
            "Bot has left!"
        );
    },
};