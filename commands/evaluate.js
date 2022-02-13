module.exports = {
    name: 'evaluate',
    description: `Evaluates an argument. (Owner only)`,
    aliases: ['e'],
    needsowner: true,
    category: "owner",
    args: true,
    needsqueue: true,
    async execute(message, args, queue) {
        const evaluation = await eval(args.join(" "))
        message.channel.send(`\`\`\`${evaluation}\`\`\``)
    },
};