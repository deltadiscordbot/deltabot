const Discord = require('discord.js');
module.exports = {
    name: 'coinflip',
    description: 'Flip a coin! Default Bet is 100',
    category: "eco",
    guildOnly: true,
    args: true,
    needsdb: true, aliases: ['coin', 'flipcoin', 'coins', 'flipcoins'],
    async execute(message, args, dbInstance) {
        const user = await dbInstance.collection("users").findOne({ id: message.author.id });
        //Check if user has an account
        if (user == null) {
            message.reply(`you do not have an account. Do \`!daily\` to make one.`)
            return;
        }
        //Set defualt bet to 100
        let bet = 100;
        //Check if user made a custom bet, and if the bet is a positive number
        if (args[1]) {
            if (isNaN(args[1])) return message.reply("Please make a valid bet.");
            if (args[1] < 0) return message.reply("HEY! Only positive bets!")
            bet = parseInt(args[1].replace(",", "."));
        } else if (user.defaultBet) { //Check if user has set a default bet before
            bet = parseInt(user.defaultBet.toString().replace(",", "."));
        }
        //Check if user has enough money to bet
        if (user.balance < bet) return message.reply("You don't have enough credits, scrub!");
        //Check what side of the coin the user is betting on
        switch (args[0].toLowerCase()) {
            case "heads":
            case "head":
                flipcoin(message, 1, bet);
                break;
            case "tails":
            case "tail":
                flipcoin(message, 0, bet);
                break;
            default:
                return message.reply("Please select between heads or tails!");
        }

        function flipcoin(message, selection, betAmount) {
            //1 = heads, 0 = tails
            let icons = ["https://cdn.discordapp.com/attachments/722141658573176842/726259751708786748/146-1464848_quarter-tail-png-tails-on-a-coin.png", "https://cdn.discordapp.com/attachments/722141658573176842/726259890481397790/2006_Quarter_Proof.png"]
            let randomSelection = Math.round(Math.random());
            let userWon = (selection == randomSelection);
            let newBalance, newTotal;
            let totalPlays = 1;
            let lastWin = user.lastWin;
            if (userWon) {
                newBalance = user.balance + betAmount;
                newTotal = user.totalCredits + betAmount;
                lastWin = betAmount
            } else {
                newBalance = user.balance - betAmount;
                newTotal = user.totalCredits - betAmount;
            }
            if (user.coinflipplays != undefined) {
                totalPlays = user.coinflipplays + 1;
            }
            const myobj = { id: message.author.id };
            const newvalues = { $set: { balance: newBalance, lastWin: lastWin, totalCredits: newTotal, coinflipplays: totalPlays } };
            dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
                if (err) throw err;
                let resultMessage = new Discord.MessageEmbed()
                    .setTitle(userWon ? `You won ${bet} credits` : `You lost ${bet} credits`)
                    .setThumbnail(icons[randomSelection])
                    .setTimestamp()
                    .setFooter(`Bet: ${bet} | Requested by: ${message.author.tag}`)
                message.reply(resultMessage);
            });
        }
    }
};
