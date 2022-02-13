module.exports = {
    name: 'addtag',
    description: 'Add a help tag. (Helper only)',
    usage: ['(tag name) (tag content)'],
    aliases: ['createtag'],
    cooldown: 10,
    category: "mod",
    needshelper: true,
    guildOnly: true,
    args: true,

    async execute(message, args) {
        var argsArray = Array.from(args);
        var tagName = argsArray.shift();
        const items = await message.client.dbInstance.collection("tags").findOne({ name: tagName });
        if (items == null) {
            var myobj = { name: tagName.toString(), content: argsArray.join(" ") };
            message.client.dbInstance.collection("tags").insertOne(myobj, function (err, res) {
                if (err) throw err;
                message.reply(`tag ${tagName} was added.`)
            });
        } else {
            message.reply("there is already a tag with that name.")
        }
    },
};