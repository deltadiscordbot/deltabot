const { stocksAPIKey, stocksSearchAPIKey } = require('../config.json');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = { method: "Get" };
module.exports = {
    name: 'stocks',
    description: 'Play the stock market.',
    category: "eco",
    guildOnly: true,
    needsdb: true,
    aliases: ['stonks', 'stock', 'stonk', 'stonx', 'stonxmarket', 'stonksmarket', 'stockmarket'],
    async execute(message, args, dbInstance) {
        const finnhub = require('finnhub');
        const defaultClient = finnhub.ApiClient.instance;
        const api_key = defaultClient.authentications['api_key'];
        api_key.apiKey = stocksAPIKey
        const api = new finnhub.DefaultApi()
        if (args.length) {
            const user = await dbInstance.collection("users").findOne({ id: message.author.id });
            const command = args.shift();
            switch (command.toString().toLowerCase()) {
                case "buy":
                case "b":
                case "purchase":
                    if (user != null) {
                        const symbol = args[0].toString().toUpperCase();
                        api.quote(symbol, (error, data, response) => {
                            if (error) {
                                console.error(error);
                            } else {
                                if (data.c == 0) {
                                    message.reply(`symbol not found.`);
                                } else {
                                    const pricePerShare = (data.c * 10).toFixed(0);
                                    if (user.balance >= pricePerShare) {
                                        const canAfford = Math.floor(user.balance / pricePerShare)
                                        message.reply(`how many shares do you want to buy at ${pricePerShare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} credits. (up to ${canAfford.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})`)
                                            .then(msg => {
                                                const buyingOptions = [];
                                                for (let index = 1; index < canAfford + 1; index++) {
                                                    buyingOptions.push(index)
                                                }
                                                const msgCollector = message.channel.createMessageCollector(m => (buyingOptions.includes(parseInt(m.content)) && m.author.id == message.author.id), { time: 30000, dispose: true });
                                                msgCollector.on("collect", m => {
                                                    const buyingAmount = parseInt(m.content);
                                                    const totalPurchase = buyingAmount * pricePerShare;
                                                    msgCollector.stop()
                                                    m.delete();
                                                    msg.edit(`${message.author}, are you sure you want to buy ${buyingAmount} shares for ${totalPurchase.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} credits?`)
                                                        .then(msg => {
                                                            msg.react("✅")
                                                            msg.react("❌")
                                                            const playFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id;
                                                            const playReact = msg.createReactionCollector(playFilter, { timer: 30000, idle: 30000, dispose: true });
                                                            const stopFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id == message.author.id;
                                                            const stopReact = msg.createReactionCollector(stopFilter, { timer: 30000, idle: 30000, dispose: true });
                                                            playReact.on("collect", (r, u) => {
                                                                playReact.stop();
                                                                stopReact.stop();
                                                                msg.reactions.removeAll();
                                                                const myobj = { ownerID: message.author.id, ownerName: message.author.tag, shareCount: buyingAmount, pricePerShare: parseInt(pricePerShare), totalPurchase: totalPurchase, symbol: symbol, dateBought: Date.now() };
                                                                dbInstance.collection("stocks").insertOne(myobj, function (err, res) {
                                                                    if (err) throw err;
                                                                    msg.edit(`${message.author}, purchase complete.`)
                                                                });
                                                                const myobj2 = { id: message.author.id };
                                                                const newBalance = user.balance - totalPurchase;
                                                                let totalStocks = buyingAmount;
                                                                if (user.totalStocks != undefined) {
                                                                    totalStocks = user.totalStocks + buyingAmount;
                                                                }
                                                                const newvalues = { $set: { balance: newBalance, totalStocks: totalStocks } };
                                                                dbInstance.collection("users").updateOne(myobj2, newvalues, function (err, res) {
                                                                    if (err) throw err;
                                                                });

                                                            })
                                                            stopReact.on("collect", (r, u) => {
                                                                playReact.stop();
                                                                stopReact.stop();
                                                                msg.reactions.removeAll();
                                                                msg.edit(`${message.author}, purchase cancelled.`)
                                                            })
                                                            stopReact.on("end", e => {
                                                                msg.reactions.removeAll();
                                                                msg.edit(`${message.author}, purchase timed out.`)
                                                            })
                                                        })
                                                })
                                                msgCollector.on("end", (c, e) => {
                                                    if (e == "time") {
                                                        msg.edit(`${message.author}, purchase timed out.`)
                                                    }
                                                })

                                            })
                                    } else {
                                        message.reply(`you do not have enough credits to buy a share of ${symbol} stock.`);
                                    }
                                }
                            }
                        })
                    } else {
                        message.reply("you do not have an account. Make one with \`!daily\`.");
                        return;
                    }

                    break;
                case "s":
                case "sell":
                    if (user != null) {
                        if (args.length) {
                            const symbol = args[0].toString().toUpperCase();
                            const stocksOwned = await dbInstance.collection("stocks").find({ ownerID: message.author.id }).toArray();
                            let stocksSelling = [];
                            stocksOwned.forEach(element => {
                                if (element.symbol == symbol) {
                                    stocksSelling.push(element)
                                }
                            });
                            let totalShares = 0;
                            let avgPricePerShare = 0;
                            let totalPurchase = 0;
                            stocksSelling.forEach(element => {
                                totalShares += element.shareCount;
                                avgPricePerShare += element.pricePerShare;
                                totalPurchase += element.totalPurchase;
                            });
                            avgPricePerShare = avgPricePerShare / totalShares;
                            api.quote(symbol, (error, data, response) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    const currentPrice = (data.c * 10).toFixed(0);
                                    message.reply(`how many shares would you like to sell for ${currentPrice} credits per share. (Up to ${totalShares.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")})`)
                                        .then(msg => {
                                            let possibleSell = [];
                                            for (let index = 1; index < totalShares + 1; index++) {
                                                possibleSell.push(index);
                                            }
                                            const msgCollector = message.channel.createMessageCollector(m => (possibleSell.includes(parseInt(m.content)) && m.author.id == message.author.id), { time: 30000, dispose: true });
                                            msgCollector.on("collect", m => {
                                                const sellingAmount = parseInt(m.content);
                                                const totalSell = sellingAmount * currentPrice;
                                                msgCollector.stop()
                                                m.delete();
                                                msg.edit(`${message.author}, are you sure you want to sell ${sellingAmount} shares for ${totalSell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} credits?`)
                                                    .then(msg => {
                                                        msg.react("✅")
                                                        msg.react("❌")
                                                        const playFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id == message.author.id;
                                                        const playReact = msg.createReactionCollector(playFilter, { timer: 30000, idle: 30000, dispose: true });
                                                        const stopFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id == message.author.id;
                                                        const stopReact = msg.createReactionCollector(stopFilter, { timer: 30000, idle: 30000, dispose: true });
                                                        playReact.on("collect", (r, u) => {
                                                            const newShareCount = totalShares - sellingAmount;
                                                            let newTotalPurchase
                                                            if (newShareCount == 0) {
                                                                newTotalPurchase = 0;
                                                                avgPricePerShare = 0;
                                                            } else {
                                                                newTotalPurchase = totalPurchase - (avgPricePerShare * sellingAmount);
                                                            }
                                                            playReact.stop();
                                                            stopReact.stop();
                                                            msg.reactions.removeAll();
                                                            var myquery = { ownerID: message.author.id, symbol: symbol };
                                                            dbInstance.collection("stocks").deleteMany(myquery, function (err, obj) {
                                                                if (err) throw err;
                                                            });
                                                            const myobj2 = { ownerID: message.author.id, ownerName: message.author.tag, shareCount: newShareCount, pricePerShare: parseInt(avgPricePerShare), totalPurchase: parseInt(newTotalPurchase), symbol: symbol, dateBought: Date.now() };

                                                            dbInstance.collection("stocks").insertOne(myobj2, function (err, res) {
                                                                if (err) throw err;
                                                            });
                                                            const myobj3 = { id: message.author.id };
                                                            const newBalance = user.balance + totalSell;
                                                            let totalStocks = 0;
                                                            if (user.totalStocks != undefined) {
                                                                totalStocks = user.totalStocks - sellingAmount;
                                                            }
                                                            //const newTotalEarnings = user.totalCredits + (sellingAmount - totalPurchase);
                                                            const newvalues = { $set: { balance: newBalance, totalStocks: totalStocks } };
                                                            dbInstance.collection("users").updateOne(myobj3, newvalues, function (err, res) {
                                                                if (err) throw err;
                                                                msg.edit(`${message.author}, sale complete. New balance is ${newBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
                                                            });

                                                        })
                                                        stopReact.on("collect", (r, u) => {
                                                            playReact.stop();
                                                            stopReact.stop();
                                                            msg.reactions.removeAll();
                                                            msg.edit(`${message.author}, sale cancelled.`)
                                                        })
                                                        stopReact.on("end", e => {
                                                            msg.reactions.removeAll();
                                                            msg.edit(`${message.author}, sale timed out.`)
                                                        })
                                                    })
                                            })
                                            msgCollector.on("end", (c, e) => {
                                                if (e == "time") {
                                                    msg.edit(`${message.author}, purchase timed out.`)
                                                }
                                            })
                                        })
                                }
                            })
                        } else {
                            message.reply("please specify a stock to sell.");
                            return;

                        }
                    } else {
                        message.reply("you do not have an account. Make one with \`!daily\`.");
                        return;
                    }
                    break;
                case "lookup":
                case "l":
                case "check":
                case "info":
                    let stockPrices;
                    let companyInfo;
                    if (args.length) {
                        const symbol = args[0].toString().toUpperCase();
                        api.quote(symbol, (error, data, response) => {
                            if (error) {
                                console.error(error);
                            } else {
                                stockPrices = data;
                                api.companyProfile2({ symbol: symbol }, (error, data, response) => {
                                    if (error) {
                                        console.error(error);
                                    } else {
                                        companyInfo = data;
                                        let companyName = "";
                                        let companyLogo = '';
                                        if (companyInfo.name == undefined) {
                                            companyName = symbol
                                        } else {
                                            companyName = companyInfo.name;
                                            companyLogo = companyInfo.logo;
                                        }
                                        if (isNaN(stockPrices.c) || stockPrices.c == 0) {
                                            message.reply("error finding stock.")
                                        } else {
                                            const embed = new Discord.MessageEmbed()
                                                .setTitle(companyName)
                                                .setThumbnail(companyLogo)
                                                .addField("Current price", (stockPrices.c * 10).toFixed(0), true)
                                                .addField("High price", (stockPrices.h * 10).toFixed(0), true)
                                                .addField("Low price", (stockPrices.l * 10).toFixed(0), true)
                                                .addField("Opening price", (stockPrices.o * 10).toFixed(0), true)
                                                .addField("Last close price", (stockPrices.pc * 10).toFixed(0), true)
                                            message.reply(embed)
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        message.reply("please specify a symbol.")
                    }
                    break;
                case "s":
                case "search":
                case "find":
                    const searchAPI = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${args.join(" ")}&apikey=${stocksSearchAPIKey}`;
                    fetch(searchAPI, settings)
                        .then(res => res.json())
                        .then((json) => {
                            let searchResults = json.bestMatches.splice(0, 5);
                            let embedFields = [];
                            searchResults.forEach(element => {
                                embedFields.push({ name: element["2. name"], value: element["1. symbol"] })
                            });
                            const embed = new Discord.MessageEmbed()
                                .setTitle("Search results")
                                .addFields(embedFields)
                                .setTimestamp()
                                .setFooter(`Requested by: ${message.author.tag}`)
                            message.channel.send(embed)
                        })
                    break;
                case "p":
                case "list":
                case "portfolio":
                    if (user != null) {
                        const stocksOwned = await dbInstance.collection("stocks").find({ ownerID: message.author.id }).toArray();
                        let stockSymbols = [];
                        let stockCounts = [];
                        let stockPrices = [];
                        stocksOwned.forEach(element => {
                            if (stockSymbols.includes(element.symbol)) {
                                stockCounts[stockSymbols.indexOf(element.symbol)] += element.shareCount;
                            } else {
                                stockSymbols.push(element.symbol);
                                stockCounts.push(parseInt(element.shareCount));
                            }
                        });
                        for (let index = 0; index < stockSymbols.length; index++) {
                            api.quote(stockSymbols[index], (error, data, response) => {
                                if (error) {
                                    console.error(error);
                                } else {
                                    stockPrices.push((parseInt(data["c"]) * 10));
                                }
                                if (index >= stockSymbols.length - 1) {
                                    let embedList = "";
                                    console.log(stockPrices)
                                    for (let index = 0; index < stockSymbols.length; index++) {
                                        if (stockCounts[index] != 0) {
                                            embedList += `${stockSymbols[index]} - ${stockCounts[index]} - ${(stockPrices[index] * stockCounts[index]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n`
                                        }
                                    }
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle("Portfolio")
                                        .setDescription(embedList)
                                        .setTimestamp()
                                    message.channel.send(embed)
                                }
                            });
                        }
                    } else {
                        message.reply("you do not have an account. Make one with \`!daily\`.");
                        return;
                    }
                    break;
                default:
                    const embed = new Discord.MessageEmbed()
                        .setTitle("How to use stocks")
                        .setDescription("\`!stocks buy [symbol]\` to buy a stock.\n\`!stocks sell [symbol]\` to sell a stock you own.\n\`!stocks lookup [symbol]\` to get information on a stock.\n\`!stocks search [search]\` to search for a company.")
                    message.reply(embed)

                    break;
            }
        } else {
            const embed = new Discord.MessageEmbed()
                .setTitle("How to use stocks")
                .setDescription("\`!stocks buy [symbol]\` to buy a stock.\n\`!stocks sell [symbol]\` to sell a stock you own.\n\`!stocks lookup [symbol]\` to get information on a stock.\n\`!stocks search [search]\` to search for a company.")
            message.reply(embed)
        }
    },
};