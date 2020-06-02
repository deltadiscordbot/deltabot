const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'profile',
    description: 'Check account profile.',
    cooldown: 10,
    guildOnly: true,
    execute(message, args, client) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            dbInstance = db.db(currentdb);
            let userID;
            let user = null;
            if (args.length) {
                if (args[0] == "me") {
                    mentionedUser = message.author;
                } else {
                    mentionedUser = message.mentions.users.first();
                }
            } else {
                mentionedUser = message.author;
            }
            if(mentionedUser == undefined){
                message.reply("please enter a valid user.")
                return;
            }
            user = await dbInstance.collection("users").findOne({ id: mentionedUser.id });
            db.close();
            if (user != null) {
                const balance = user.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                let lastWin = 0;
                let blackjackPlays = 0;
                let slotsPlays = 0;
                let defaultBet = 100;
                let con4Plays = 0;
                let con4Wins = 0;
                if (user.lastWin != undefined) {
                    lastWin = user.lastWin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (user.con4Wins != undefined) {
                    con4Wins = user.con4Wins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
                if (user.con4Plays != undefined) {
                    con4Plays = user.con4Plays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                }                const profileEmbed = new Discord.MessageEmbed()
                    .setAuthor(mentionedUser.tag, mentionedUser.avatarURL())
                    .setColor(user.color)
                    .addField("Balance:", balance, true)
                    .addField("Total earnings:", totalCredits, true)
                    .addField("Default bet:", defaultBet, true)
                    .addField("Slots plays:", slotsPlays, true)
                    .addField("Blackjack plays:", blackjackPlays, true)
                    .addField("Connect 4 plays:", con4Plays, true)
                    .addField("Connect 4 wins:", con4Wins, true)
                    .addField("Last win:", lastWin, true)
                message.channel.send(profileEmbed)
            } else {
                message.reply("that user does not have an account.")
            }
        });


    },
};