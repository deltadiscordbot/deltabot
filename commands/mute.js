module.exports = {
    name: 'mute',
    description: 'Mutes user. (Mod only)',
    cooldown: 5,
    category: "mod",
    guildOnly: true,
    needsmod: true,
    args: true,
    async execute(message, args) {
        if (message.guild.roles.cache.find(muterole => muterole.name === "Muted") == undefined) {
            await message.guild.roles.create({
                data: {
                    name: "Muted",
                }
            })
        }
        const mutedRole = await message.guild.roles.cache.find(muterole => muterole.name === "Muted");
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
        if (userObject == message.author) {
            message.reply("you can't mute yourself.")
            return;
        }
        const memberObject = message.guild.member(userObject);
        if (!memberObject.roles.cache.some(role => role.name === "Muted")) {
            memberObject.roles.add(mutedRole);
            message.reply(`muted ${memberObject.user.tag}`)
        } else {
            message.reply("this member is already muted.")
        }
        if (message.guild.mutedDone == undefined || message.guild.mutedDone == false) {
            message.guild.channels.cache.forEach(channel => {
                channel.updateOverwrite(mutedRole, { SEND_MESSAGES: false });
            })
            message.guild.mutedDone = true;
        };
    },
};