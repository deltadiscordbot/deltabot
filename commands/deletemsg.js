module.exports = {
    name: 'deletemsg',
    description: `Deletes a specfic message. (Owner only)`,
    usage: ['[channel ID] [Message ID]'],
    cooldown: 10,
    needsowner: true,
    args: true,
    guildOnly: true,
    execute(message, args) {
        message.guild.channels.cache.get(args[0]).messages.fetch(args[1])
            .then(message2 => {
                message.delete();
                message2.delete();
            })
            .catch(console.error);
    },
};