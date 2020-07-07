module.exports = {
    name: 'setcolor',
    description: 'Set profile color.',
    cooldown: 10,
    guildOnly: true,
    args: true,

    category: "eco",
    async execute(message, args) {
        const user = await message.client.dbInstance.collection("users").findOne({ id: message.author.id });
        if (user != null) {
            let newColor = args[0].toString();
            if (args[0].substring(0, 1) != "#") {
                newColor = `#${args[0].toString()}`
            }
            if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                const myobj = { id: message.author.id };
                const newvalues = { $set: { color: args[0].toString() } };
                message.client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
                    if (err) throw err;
                    message.reply(`new color has been set.`)
                });
            } else {
                message.reply("please enter a valid color hex.")
            }
        } else {
            message.reply("you do not have an account. Make one with \`!daily\`.")
        }
    },
};