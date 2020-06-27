module.exports = {
    name: 'edittag',
    description: 'Edits a help tag. (Helper only)',
    usage: ['(tag name) (tag content)'],
    cooldown: 10,
    aliases: ['changetag'],
    needshelper: true,
    category: "mod",
    guildOnly: true,
    args: true,
    needsdb: true,
    async execute(message, args, dbInstance) {
        var argsArray = Array.from(args);
        var tagName = argsArray.shift();
        const items = await dbInstance.collection("tags").findOne({ name: tagName });
        if (items != null) {
            var myobj = { name: tagName };
            var newvalues = { $set: { name: tagName, content: argsArray.join(" ") } };
            dbInstance.collection("tags").updateOne(myobj, newvalues, function (err, res) {
                if (err) throw err;
                message.reply(`tag ${tagName} was edited.`)
            });
        } else {
            message.reply("there is no tag with that name.")
        }
    },
};