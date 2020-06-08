const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'blackjack',
    description: 'Play blackjack. Default bet is 100.',
    guildOnly: true,
    aliases: ['catch21', 'bj'],
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            let bet = 100;
            let winnings = 0;
            dbInstance = db.db(currentdb);
            const user = await dbInstance.collection("users").findOne({ id: message.author.id });
            if (user == null) {
                message.reply(`you do not have an account. Do \`!daily\` to make one.`)
                db.close();
            } else {
                if (args.length) {
                    if (isNaN(args[0])) {
                        message.reply("please make a valid bet.")
                        return;
                    } else {
                        bet = parseInt(args[0].replace(",", "."));
                    }
                } else if (user.defaultBet) {
                    bet = parseInt(user.defaultBet.toString().replace(",", "."));
                }
                //Actual game
                if (user.balance >= bet && bet > 0) {
                    let cards = ["<:redQ:716024077483114596>", "<:redK:716024077684572211>", "<:redJ:716024077319536661>", "<:redA:716024077424263259>", "<:red9:716024077491372114>", "<:red8:716024077592297522>", "<:red10:716024077407617156>", "<:red2:716024077235519490>", "<:red3:716024077927579709>", "<:red4:716024077420068895>", "<:red5:716024077277593695>", "<:red6:716024077713670187>", "<:red7:716024077264879667>", "<:blackQ:716024077655081000>", "<:blackK:716024077831372900>", "<:blackJ:716024077395165267>", "<:blackA:716024077596229643>", "<:black9:716024077730709545>", "<:black8:716024077562937365>", "<:black10:716024077680115785>", "<:black2:716024077864665170>", "<:black3:716024077860470826>", "<:black4:716024077793493094>", "<:black5:716024078019985479>", "<:black6:716024077856538674>", "<:black7:716024077411942513>", "<:redQ:716024077483114596>", "<:redK:716024077684572211>", "<:redJ:716024077319536661>", "<:redA:716024077424263259>", "<:red9:716024077491372114>", "<:red8:716024077592297522>", "<:red10:716024077407617156>", "<:red2:716024077235519490>", "<:red3:716024077927579709>", "<:red4:716024077420068895>", "<:red5:716024077277593695>", "<:red6:716024077713670187>", "<:red7:716024077264879667>", "<:blackQ:716024077655081000>", "<:blackK:716024077831372900>", "<:blackJ:716024077395165267>", "<:blackA:716024077596229643>", "<:black9:716024077730709545>", "<:black8:716024077562937365>", "<:black10:716024077680115785>", "<:black2:716024077864665170>", "<:black3:716024077860470826>", "<:black4:716024077793493094>", "<:black5:716024078019985479>", "<:black6:716024077856538674>", "<:black7:716024077411942513>"];
                    const cardBack = "<:cardback:716320555346821160>";
                    let dealersHand, playerHand, cardValue;
                    let playerValues = 0, dealerValues = 0;
                    let bust = false;
                    function randomCard() {
                        return `${[Math.floor(Math.random() * cards.length)]}`
                    }
                    function hit(player, currentValue) {
                        let newCard = cards.splice(randomCard(), 1).toString();
                        cardValue = newCard.split(":");
                        cardValue = cardValue[1].substring(cardValue[1].length - 1, cardValue[1].length)
                        switch (cardValue) {
                            case "K":
                            case "Q":
                            case "J":
                            case "0":
                                cardValue = 10;
                                break;
                            case "A":
                                if (currentValue + 11 > 21) {
                                    cardValue = 1;
                                } else {
                                    cardValue = 11;
                                }
                                break;
                            default:
                                cardValue = parseInt(cardValue);
                                break;
                        }
                        if (player == "p") {
                            playerValues += cardValue;
                            if (playerValues > 21) {
                                bust = true;
                            }
                        } else {
                            dealerValues += cardValue;
                        }
                        return newCard;
                    }
                    let color;
                    let title;
                    function dealersTurn(msg) {
                        dealersHand = `${dealersHand} ${hit("d", dealerValues)}`
                        blackjackEmbed = new Discord.MessageEmbed()
                            .setTitle("Blackjack")
                            .setColor(color)
                            .addField("Current balance", authorText)
                            .addField("DeltaBot's hand:", `${dealersHand}\n${dealerValues}`)
                            .addField("Your hand:", `${playerHand}\n${playerValues}`)
                            .setFooter(`Bet: ${bet} | ${message.author.tag}`)
                        msg.edit(blackjackEmbed)
                    }
                    let newBalanceField;
                    let didDouble;
                    function endGame(msg) {
                        endBlackjackEmbed = new Discord.MessageEmbed()
                            .setTitle(title)
                            .setColor(color)
                            .addField("Current balance", newBalanceField)
                            .addField("DeltaBot's hand:", `${dealersHand}\n${dealerValues}`)
                            .addField("Your hand:", `${playerHand}\n${playerValues}`)
                            .setFooter(`Bet: ${bet} | ${message.author.tag}`)
                        msg.edit(endBlackjackEmbed)
                        dbInstance = db.db(currentdb);
                        const newBalance = user.balance - bet + winnings;
                        const newTotal = user.totalCredits + winnings;
                        let totalPlays = 0;
                        let lastWin = user.lastWin;
                        if (winnings > 0) {
                            lastWin = winnings
                        }
                        if (user.blackjackPlays != undefined) {
                            totalPlays = user.blackjackPlays + 1;
                        }
                        const myobj = { id: message.author.id };
                        const newvalues = { $set: { balance: newBalance, lastWin: lastWin, totalCredits: newTotal, blackjackPlays: totalPlays } };
                        dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
                            if (err) throw err;
                        });
                    }
                    let playerTurnEnd = false;
                    function gameover(msg) {
                        playerTurnEnd = true;
                        if (bust) {
                            color = "#ff0000"
                            title = "Bust";
                            newBalanceField = `${(user.balance - bet + winnings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                            endGame(msg);
                        } else {
                            setTimeout(() => {
                                if (dealerValues < 17) {
                                    dealersTurn(msg);
                                    gameover(msg);
                                    return;
                                } else {
                                    if (dealerValues > 21) {
                                        title = "WIN!"
                                        if (didDouble) {
                                            color = "#FFD700"
                                        } else {
                                            color = "#00ff00"
                                        }
                                        winnings = bet * 2;
                                        newBalanceField = `${(user.balance - bet + winnings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} +${winnings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                    } else if (dealerValues == playerValues) {
                                        title = "Push!"
                                        if (didDouble) {
                                            color = "#FFD700"
                                        } else {
                                            color = "#00ff00"
                                        }
                                        winnings = Math.ceil(bet * 1.5);
                                        newBalanceField = `${(user.balance - bet + winnings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} +${winnings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                    } else if (dealerValues > playerValues) {
                                        color = "#ff0000"
                                        title = "Lose";
                                        newBalanceField = `${(user.balance - bet + winnings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                    } else if (playerValues > dealerValues) {
                                        title = "WIN!"
                                        if (didDouble) {
                                            color = "#FFD700"
                                        } else {
                                            color = "#00ff00"
                                        }
                                        winnings = bet * 2;
                                        newBalanceField = `${(user.balance - bet + winnings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} +${winnings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                                    }
                                    endGame(msg);
                                }
                            }, 1000);
                        }
                    }
                    dealersHand = `${hit("d", dealerValues)}`
                    playerHand = `${hit("p", playerValues)} ${hit("p", playerValues)}`
                    let authorText = `${(user.balance - bet).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
                    blackjackEmbed = new Discord.MessageEmbed()
                        .setTitle("Blackjack")
                        .addField("Current balance", authorText)
                        .addField("DeltaBot's hand:", `${dealersHand} ${cardBack}\n${dealerValues}`)
                        .addField("Your hand:", `${playerHand}\n${playerValues}`)
                        .setFooter(`Bet: ${bet} | ${message.author.tag}`)
                    message.reply(blackjackEmbed)
                        .then(msg => {
                            if (playerValues < 21) {
                                msg.react("⬆️");
                                msg.react("⏹️");
                                let doubleFilter, double;
                                if (user.balance > (bet * 2)) {
                                    msg.react("2️⃣");
                                    doubleFilter = (reaction, user) => reaction.emoji.name === '2️⃣' && user.id === message.author.id;
                                    double = msg.createReactionCollector(doubleFilter, { timer: 15000, dispose: true });
                                }
                                const hitFilter = (reaction, user) => reaction.emoji.name === '⬆️' && user.id === message.author.id;
                                const hitReact = msg.createReactionCollector(hitFilter, { timer: 15000, idle: 15000, dispose: true });
                                const stopFilter = (reaction, user) => reaction.emoji.name === '⏹️' && user.id === message.author.id;
                                const stop = msg.createReactionCollector(stopFilter, { timer: 15000, dispose: true });
                                let canDouble = true;
                                hitReact.on('collect', r => {
                                    hitReact.resetTimer()
                                    stop.resetTimer()
                                    if (double != undefined) {
                                        double.stop();
                                    }
                                    if (canDouble) {
                                        if (msg.reactions.cache.get('2️⃣') != undefined) {
                                            msg.reactions.cache.get('2️⃣').remove().catch(error => console.error('Failed to remove reactions: ', error));
                                            canDouble = false;
                                        }
                                    }
                                    playerHand = `${playerHand} ${hit("p", playerValues)}`
                                    blackjackEmbed = new Discord.MessageEmbed()
                                        .setTitle("Blackjack")
                                        .addField("Current balance", authorText)
                                        .addField("DeltaBot's hand:", `${dealersHand} ${cardBack}\n${dealerValues}`)
                                        .addField("Your hand:", `${playerHand}\n${playerValues}`)
                                        .setFooter(`Bet: ${bet} | ${message.author.tag}`)
                                    msg.edit(blackjackEmbed)
                                    if (playerValues >= 21) {
                                        playerTurnEnd = true;
                                        msg.reactions.removeAll();
                                        stop.stop();
                                        hitReact.stop();
                                        gameover(msg);
                                        return;
                                    } else {
                                        const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                                        try {
                                            for (const reaction of userReactions.values()) {
                                                reaction.users.remove(message.author.id);
                                            }
                                        } catch (error) {
                                            console.error('Failed to remove reactions.');
                                        }
                                    }
                                });

                                stop.on('collect', r => {
                                    msg.reactions.removeAll();
                                    stop.stop();
                                    hitReact.stop();
                                    if (!playerTurnEnd) {
                                        gameover(msg)
                                    };
                                    playerTurnEnd = true;
                                    return;
                                });
                                if (double != undefined) {
                                    double.on('collect', r => {
                                        playerTurnEnd = true;
                                        msg.reactions.removeAll();
                                        stop.stop();
                                        hitReact.stop();
                                        didDouble = true;
                                        bet = bet * 2;
                                        playerHand = `${playerHand} ${hit("p", playerValues)}`
                                        blackjackEmbed = new Discord.MessageEmbed()
                                            .setTitle("Blackjack")
                                            .setColor(color)
                                            .addField("Current balance", authorText)
                                            .addField("DeltaBot's hand:", `${dealersHand} ${cardBack}\n${dealerValues}`)
                                            .addField("Your hand:", `${playerHand}\n${playerValues}`)
                                            .setFooter(`Bet: ${bet} | ${message.author.tag}`)
                                        msg.edit(blackjackEmbed)
                                        if (playerValues > 21) {
                                            bust = true;
                                        }
                                        gameover(msg)
                                    });
                                }
                                hitReact.on('end', e => {
                                    msg.reactions.removeAll();
                                    if (!playerTurnEnd) {
                                        gameover(msg)
                                    };
                                    return;
                                })
                            } else {
                                if (!playerTurnEnd) {
                                    setTimeout(() => {
                                        gameover(msg)
                                    }, 1000);
                                };
                            }
                        })
                } else {
                    if (bet == 0) {
                        message.reply("please make a bet.")
                        return;
                    }
                    message.reply("sorry, you do not have enough credits to make that bet.")
                }
            }

        });

    },
};