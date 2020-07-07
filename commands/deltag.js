module.exports = {
    name: 'deltag',
    description: 'Removes a help tag. (Mod only)',
    usage: ['(tag name)'],
    aliases: ['deletetag'],
    cooldown: 10,
    needsmod: true,
    category: "mod",
    guildOnly: true,
    args: true,

    async execute(message, args) {
        const items = await message.client.dbInstance.collection("tags").findOne({ name: args.toString() });
        if (items != null) {
            var myobj = { name: args.toString() };
            message.client.dbInstance.collection("tags").deleteOne(myobj, function (err, res) {
                if (err) throw err;
                message.reply(`tag ${args.toString()} was deleted.`)
            });
        } else {
            message.reply("there is no tag with that name.")
        }

    },
};