module.exports = {
    name: 'evaluate',
    description: `Evaluates an argument. (Owner only)`,
    aliases: ['e'],
    needsowner: true,
    category: "owner",
    args: true,
    execute(message, args) {
        const evaluation = eval(args.join(" "))
        message.channel.send(`\`\`\`${evaluation}\`\`\``)
    },
};