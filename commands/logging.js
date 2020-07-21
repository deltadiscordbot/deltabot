module.exports = {
    name: 'logging',
    description: 'Enables logging. (Owner only)',
    needsowner: true,
    cooldown: 1,
    category: "owner",
    async execute(message, args) {
        message.client.logging = !message.client.logging;
        message.reply(`logging set to ${message.client.logging}`)
    }
}