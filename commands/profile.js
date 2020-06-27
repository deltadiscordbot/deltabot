const Discord = require('discord.js');
module.exports = {
    name: 'profile',
    description: 'Check account profile.',
    guildOnly: true,
    needsdb: true,
    category: "eco",
    async execute(message, args, dbInstance) {
        const client = message.client;
        let userID;
        let user = null;
        if (args.length) {
            if (message.mentions.users.size) {
                mentionedUser = message.mentions.users.first()
            } else if (client.users.cache.find(user => user.id === args[0].toString())) {
                mentionedUser = client.users.cache.find(user => user.id === args[0].toString())
            } else if (client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())) {
                mentionedUser = client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())
            } else {
                mentionedUser = message.author
            }
        } else {
            mentionedUser = message.author
        }
        if (mentionedUser == undefined) {
            message.reply("please enter a valid user.")
            return;
        }
        user = await dbInstance.collection("users").findOne({ id: mentionedUser.id });
        if (user != null) {
            const balance = user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            let lastWin = 0;
            let blackjackPlays = 0;
            let slotsPlays = 0;
            let defaultBet = 100;
            let con4Plays = 0;
            let con4Wins = 0;
            let cfPlays = 0;
            let tttPlays = 0;
            let tttWins = 0;
            let talkCredits = 0;
            let floorsOwned = "";
            if (user.lastWin != undefined) {
                lastWin = user.lastWin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.floorsOwned != undefined) {
                const floorData = await dbInstance.collection("hotel").find({}).toArray();
                for (let index = 0; index < (floorData.length); index++) {
                    if (floorData[index].ownerID == mentionedUser.id) {
                        floorsOwned += `${floorData[index].floor}, `
                    }

                }
            }
            if (floorsOwned == "") {
                floorsOwned = "None__"
            }
            if (user.con4Wins != undefined) {
                con4Wins = user.con4Wins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.coinflipplays != undefined) {
                cfPlays = user.coinflipplays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.con4Plays != undefined) {
                con4Plays = user.con4Plays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.tttWins != undefined) {
                tttWins = user.tttWins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.talkCredits != undefined) {
                talkCredits = user.talkCredits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.tttPlays != undefined) {
                tttPlays = user.tttPlays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.blackjackPlays != undefined) {
                blackjackPlays = user.blackjackPlays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            if (user.defaultBet != undefined) {
                defaultBet = user.defaultBet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            const totalCredits = user.totalCredits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            if (user.slotsPlays != undefined) {
                slotsPlays = user.slotsPlays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            } const profileEmbed = new Discord.MessageEmbed()
                .setAuthor(mentionedUser.tag, mentionedUser.avatarURL())
                .setColor(user.color)
                .addField("Balance:", balance, true)
                .addField("Total earnings:", totalCredits, true)
                .addField("Message earnings:", talkCredits, true)
                .addField("Hotel floors owned:", floorsOwned.substring(0, floorsOwned.length - 2), true)
                .addField("Default bet:", defaultBet, true)
                .addField("Slots plays:", slotsPlays, true)
                .addField("Blackjack plays:", blackjackPlays, true)
                .addField("Connect 4 plays:", con4Plays, true)
                .addField("Connect 4 wins:", con4Wins, true)
                .addField("Tic Tac Toe plays:", tttPlays, true)
                .addField("Tic Tac Toe wins:", tttWins, true)
                .addField("Coin flip plays:", cfPlays, true)
                .addField("Last win:", lastWin, true)
            message.channel.send(profileEmbed)
        } else {
            message.reply("that user does not have an account.")
        }
    },
};