module.exports = {
    name: 'clean',
    description: 'Deletes messages sent by DeltaBot. (Helper only)',
    usage: ['[number]'],
    cooldown: 5,
    category: "mod",
    guildOnly: true,
    needshelper: true,
    execute(message, args) {
        let amount = 1;
        if (args.length) {
            amount = parseInt(args[0]);
        }
        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount > 50) {
            return message.reply('you need to input a number below 50.');
        }
        message.channel.messages.fetch({})
            .then(messages => {
                const botMessages = messages.filter(m => m.author.id === '708722716685107324').array().slice(0, amount);
                message.delete();
                message.channel.bulkDelete(botMessages, true).catch(err => {
                    console.error(err);
                    message.channel.send('there was an error trying to prune messages in this channel!');
                });
            })
            .catch(console.error);

    },
};