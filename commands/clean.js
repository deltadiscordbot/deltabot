module.exports = {
    name: 'clean',
    description: 'Deletes specified number of messages sent by the bot. (Mod only)',
    usage: ['[number]'],
    cooldown: 5,
    args: true,
    guildOnly: true,
    needsmod: true,
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount < 2 || amount > 100) {
            return message.reply('you need to input a number between 2 and 100.');
        }
        message.channel.messages.fetch({ limit: amount })
        .then(messages => {
            var botMessages = messages.filter(m => m.author.id === '708722716685107324');
            message.channel.bulkDelete(botMessages, true).catch(err => {
                console.error(err);
                message.channel.send('there was an error trying to prune messages in this channel!');
            });
    
        })
        .catch(console.error);

    },
};