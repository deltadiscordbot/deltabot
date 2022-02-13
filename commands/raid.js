module.exports = {
    name: 'raid',
    description: 'Toggles raid mode. (Admin only)',
    cooldown: 5,
    category: "admin",
    guildOnly: true,
    needsadmin: true,
    async execute(message, args) {
        let everyone = message.guild.roles.everyone;
        if (!message.guild.raidmode || message.guild.raidmode == undefined) {
            message.guild.everyoneperms = everyone.permissions;
            if (everyone.permissions.has("SEND_MESSAGES")) {
                await everyone.edit({
                    permissions: everyone.permissions.allow & ~0x800
                });
                message.reply(`server locked down.`);
                message.guild.raidmode = true;
            } else {
                message.reply(`server already locked down.`);
            }
        } else {
            if (!everyone.permissions.has("SEND_MESSAGES")) {
                await everyone.edit({
                    permissions: message.guild.everyoneperms
                });
                message.guild.raidmode = false;
                message.reply(`unlocked server.`);
            }
        }
    },
};