module.exports = {
    name: 'evaluate',
    description: `Evaluates an argument. (Owner only)`,
    aliases: ['e'],
    needsowner: true,
    needsclient: true,
    args: true,
    execute(message, args, client) {
        const evaluation = eval(args.join(" "))
        message.channel.send(`\`\`\`${evaluation}\`\`\``)
    },
};