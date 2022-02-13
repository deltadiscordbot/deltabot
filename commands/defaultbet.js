module.exports = {
    name: 'defaultbet',
    description: 'Sets your default bet.',
    cooldown: 5,
    guildOnly: true,
    category: "eco",
    args: true,

    async execute(message, args) {
        const user = await message.client.dbInstance.collection("users").findOne({ id: message.author.id });
        if (user != null) {
            let bet = 100;
            if (isNaN(args[0]) || args[0] == Infinity || parseInt(args[0]) < 1 || args[0].toString().includes(".", ",")) {
                message.reply("please set a valid bet.")
                return;
            } else {
                bet = parseInt(args[0].replace(",", "."));
            }
            const myobj = { id: message.author.id };
            const newvalues = { $set: { defaultBet: bet } };
            message.client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
                if (err) throw err;
                message.reply(`new default bet has been set.`)
            });
        } else {
            message.reply("you do not have an account. Make one with \`!daily\`.")
        }
    },
};