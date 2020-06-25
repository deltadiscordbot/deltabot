const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const {mongodbase, currentdb} = require('../config.json');
module.exports = {
    name: 'coinflip',
    description: 'Flip a coin! Default Bet is 100',
    category: "eco",
    guildOnly: true,
    args: true,
    aliases: ['coin', 'flipcoin', 'coins', 'flipcoins'],
    async execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            dbInstance = db.db(currentdb);
            const user = await dbInstance.collection("users").findOne({ id: message.author.id });
            //Check if user has an account
            if (user == null) {
				message.reply(`you do not have an account. Do \`!daily\` to make one.`)
                return db.close();
            }
            //Set defualt bet to 100
            let bet = 100;
            //Check if user made a custom bet, and if the bet is a positive number
            if (args[1]){
                if (isNaN(args[1])) return message.reply("Please make a valid bet.");
                if (args[1] < 0) return message.reply("HEY! Only positive bets!")
                bet = parseInt(args[1].replace(",", "."));
            } else if (user.defaultBet) { //Check if user has set a default bet before
                bet = parseInt(user.defaultBet.toString().replace(",", "."));
            }
            //Check if user has enough money to bet
            if (user.balance < bet) return message.reply("You don't have enough money, scrub!");
            //Check what side of the coin the user is betting on
            switch (args[0].toLowerCase()){
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

            function flipcoin(message, selection, betAmount){
                //1 = heads, 0 = tails
                let icons = ["https://www.nicepng.com/png/full/146-1464848_quarter-tail-png-tails-on-a-coin.png", "https://upload.wikimedia.org/wikipedia/commons/a/a0/2006_Quarter_Proof.png"]
                let randomSelection = Math.round(Math.random());
                let userWon = (selection == randomSelection);
                let newBalance;
                if (userWon){
                    newBalance = user.balance + betAmount;
                } else {
                    newBalance = user.balance - betAmount;
                }
                const myobj = { id: message.author.id };
                const newvalues = { $set: { balance: newBalance } };
                dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
                    if (err) throw err;
                    let resultMessage = new Discord.MessageEmbed()
                    .setTitle(userWon ? `You won \$${bet}` : `You lost \$${bet}`)
                    .setImage(icons[randomSelection])
                    message.reply(resultMessage);
                });
            }
            db.close();
        });
    }
};