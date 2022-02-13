module.exports = {
    name: 'say',
    description: 'Say what you type. (Mod only)',
    usage: ['(Said text)'],
    needsmod: true,
    args: true,
    guildOnly: true,
    category: "mod",
    execute(message, args) {
        message.delete();
        message.channel.send(args.join(" "));
    },
};