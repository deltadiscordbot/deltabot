module.exports = {
    name: 'say',
    description: 'Say what you type. (Mod only)',
    usage: ['(Said text)'],
    cooldown: 10,
    needsmod: true,
    args: true,
    execute(message, args) {
        message.channel.send(args.join(" "));
    },
};