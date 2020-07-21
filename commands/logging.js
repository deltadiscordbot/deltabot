module.exports = {
    name: 'logging',
    description: 'Enables logging. (Helper only)',
    needshelper: true,
    cooldown: 1,
    category: "mod",
    async execute(message, args) {
        message.client.logging = !message.client.logging;
        message.reply(`logging set to ${message.client.logging}`)
    }
}