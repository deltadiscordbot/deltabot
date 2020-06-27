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
    needsdb: true,
    async execute(message, args, dbInstance) {
        const items = await dbInstance.collection("tags").findOne({ name: args.toString() });
        if (items != null) {
            var myobj = { name: args.toString() };
            dbInstance.collection("tags").deleteOne(myobj, function (err, res) {
                if (err) throw err;
                message.reply(`tag ${args.toString()} was deleted.`)
            });
        } else {
            message.reply("there is no tag with that name.")
        }

    },
};