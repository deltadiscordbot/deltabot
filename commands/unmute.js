module.exports = {
    name: 'unmute',
    description: 'Unmutes user. (Mod only)',
    cooldown: 5,
    category: "mod",
    guildOnly: true,
    needsmod: true,
    args: true,
    async execute(message, args) {
        const mutedRole = message.guild.roles.cache.find(muterole => muterole.name === "Muted");
        if (message.mentions.users.size) {
            userObject = message.mentions.users.first()
        } else if (message.client.users.cache.find(user => user.id === args[0].toString())) {
            userObject = message.client.users.cache.find(user => user.id === args[0].toString())
        } else if (message.client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())) {
            userObject = message.client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())
        } else {
            message.reply("please add a member to be muted.")
            return;
        }
        const memberObject = message.guild.member(userObject);
        if (memberObject.roles.cache.some(role => role.name === "Muted")) {
            memberObject.roles.remove(mutedRole);
            message.reply(`unmuted ${memberObject.user.tag}`)
        } else {
            message.reply("this member isn't muted.")
        }
    },
};