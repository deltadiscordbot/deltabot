var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'hotel',
    description: 'Visit DeltaBot Hotel. \`!hotel\` for a guide.',
    guildOnly: true,
    category: "eco",
    aliases: ['floor'],
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            const dbInstance = db.db(currentdb);
            if (args.length) {
                let user;
                switch (args[0].toString().toLowerCase()) {
                    case "buy":
                        user = await dbInstance.collection("users").findOne({ id: message.author.id });
                        if (user != null) {
                            if (user.hotelbanned == undefined) {
                                if (!isNaN(args[1])) {
                                    const buyingFloor = parseInt(args[1]);
                                    const floorData = await dbInstance.collection("hotel").findOne({ floor: buyingFloor });
                                    if (floorData == null) {
                                        let ownedFloors = 0;
                                        let basePrice = 1000;
                                        let complete = false;
                                        if (user.floorsOwned != undefined) {
                                            ownedFloors = user.floorsOwned;
                                        }
                                        let buyingPrice = basePrice * (ownedFloors + 1);
                                        if (user.balance >= buyingPrice) {
                                            let floorName = "", floorIcon = "", floorDescription = "";
                                            message.reply(`are you sure you want to buy floor ${buyingFloor} for ${buyingPrice} credits?`)
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
                                                        msg.edit("Floor name:")
                                                            .then(msg2 => {
                                                                const msgCollector = message.channel.createMessageCollector(m => (m.author.id == message.author.id), { time: 30000 });
                                                                msgCollector.on("collect", m => {
                                                                    floorName = m.content.toString();
                                                                    complete = true;
                                                                    msgCollector.stop();
                                                                    m.delete()
                                                                        .then(msg2 => {
                                                                            complete = false;
                                                                            msg.edit("Floor description:")
                                                                            const msgCollector = message.channel.createMessageCollector(m => (m.author.id == message.author.id), { time: 30000 });
                                                                            msgCollector.on("collect", m => {
                                                                                floorDescription = m.content.toString().substring(0, 2048);
                                                                                complete = true
                                                                                msgCollector.stop();
                                                                                m.delete()
                                                                                    .then(msg2 => {
                                                                                        complete = false;
                                                                                        msg.edit("Floor icon:")
                                                                                        const msgCollector = message.channel.createMessageCollector(m => (m.author.id == message.author.id), { time: 30000 });
                                                                                        msgCollector.on("collect", m => {
                                                                                            function validURL(str) {
                                                                                                const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                                                                                                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                                                                                                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                                                                                                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                                                                                                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                                                                                                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                                                                                                return !!pattern.test(str);
                                                                                            }
                                                                                            let floorIcon = "";
                                                                                            if (validURL(m.content.toString())) {
                                                                                                floorIcon = m.content.toString();
                                                                                                complete = true;
                                                                                                msgCollector.stop();
                                                                                                m.delete()
                                                                                                    .then(msg2 => {

                                                                                                        const myobj = { floor: buyingFloor, floorName: floorName, floorDescription: floorDescription, floorIcon: floorIcon, ownerID: message.author.id, ownerName: message.author.tag, price: buyingPrice };
                                                                                                        dbInstance.collection("hotel").insertOne(myobj, function (err, res) {
                                                                                                            if (err) throw err;
                                                                                                            msg.edit("Floor purchase complete.")
                                                                                                        });
                                                                                                        const myobj2 = { id: message.author.id };
                                                                                                        const newBalance = user.balance - buyingPrice;
                                                                                                        const newFloorsOwned = ownedFloors + 1;
                                                                                                        const newvalues = { $set: { balance: newBalance, floorsOwned: newFloorsOwned } };
                                                                                                        dbInstance.collection("users").updateOne(myobj2, newvalues, function (err, res) {
                                                                                                            if (err) throw err;
                                                                                                        });
                                                                                                    })
                                                                                            } else {
                                                                                                msg.edit("Please enter a valid image URL.")
                                                                                                m.delete();
                                                                                            }
                                                                                        })
                                                                                        msgCollector.on("end", e => {
                                                                                            if (!complete) {
                                                                                                msg.edit("Floor purchase timed out.")
                                                                                            }
                                                                                        })
                                                                                    })
                                                                            })
                                                                            msgCollector.on("end", e => {
                                                                                if (!complete) {
                                                                                    msg.edit("Floor purchase timed out.")
                                                                                }
                                                                            })
                                                                        })
                                                                })
                                                                msgCollector.on("end", e => {
                                                                    if (!complete) {
                                                                        msg.edit("Floor purchase timed out.")
                                                                    }
                                                                })
                                                            })
                                                    })
                                                    stopReact.on("collect", (r, u) => {
                                                        playReact.stop();
                                                        stopReact.stop();
                                                        msg.reactions.removeAll();
                                                        msg.edit("Purchase cancelled.")
                                                        return;
                                                    })
                                                    playReact.on("end", e => {
                                                        msg.reactions.removeAll();
                                                        msg.edit("Purchase cancelled.")
                                                    })
                                                })
                                        } else {
                                            message.reply("you do not have enough credits for this purchase.")
                                        }
                                    } else {
                                        message.reply("that floor is taken.")
                                    }
                                }
                                else {
                                    message.reply("please enter a valid number.")
                                    return;
                                }
                            } else { message.reply("you have been banned from the hotel.") }
                        } else {
                            message.reply("you do not have an account. Make one with \`!daily\`.");
                            return;
                        }
                        break;
                    case "sell":
                        user = await dbInstance.collection("users").findOne({ id: message.author.id });
                        if (user != null) {
                            if (!isNaN(args[1])) {
                                const sellingFloor = parseInt(args[1]);
                                const floorData = await dbInstance.collection("hotel").findOne({ floor: sellingFloor });
                                if (floorData != null) {
                                    const sellingPrice = floorData.price / 2;
                                    if (floorData.ownerID == message.author.id) {
                                        message.reply(`are you sure you want to sell floor ${sellingFloor} for ${sellingPrice} credits?`)
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
                                                    const newBalance = user.balance + sellingPrice;
                                                    const newFloorsOwned = user.floorsOwned - 1;
                                                    const myobj2 = { id: message.author.id };
                                                    const newvalues = { $set: { balance: newBalance, floorsOwned: newFloorsOwned } };
                                                    dbInstance.collection("users").updateOne(myobj2, newvalues, function (err, res) {
                                                        if (err) throw err;
                                                    });
                                                    const myobj3 = { floor: sellingFloor };
                                                    dbInstance.collection("hotel").deleteOne(myobj3, function (err, res) {
                                                        if (err) throw err;
                                                        msg.edit(`Floor ${sellingFloor} was sold for ${sellingPrice}.`)
                                                    });
                                                })
                                                stopReact.on("collect", (r, u) => {
                                                    playReact.stop();
                                                    stopReact.stop();
                                                    msg.reactions.removeAll();
                                                    msg.edit("Sale cancelled.")
                                                })
                                                playReact.on("end", e => {
                                                    msg.reactions.removeAll();
                                                    msg.edit("Sale timed out.")
                                                })

                                            })
                                    } else {
                                        message.reply("you do not own that floor.")
                                    }
                                } else {
                                    message.reply("that floor is not owned.")
                                }
                            } else {
                                message.reply("please enter a valid number.")
                            }
                        } else {
                            message.reply("you do not have an account. Make one with \`!daily\`.")
                        }
                        break;
                    case "top":
                    case "leaderboard":
                        dbInstance.collection("users").find({}).toArray(function (err, result) {
                            if (err) throw err;
                            let userList = [];
                            result.forEach(element => {
                                if (element.floorsOwned != undefined) {
                                    userList.push({ name: element.name, floorsOwned: element.floorsOwned })
                                }
                            });
                            function compare(a, b) {
                                // Use toUpperCase() to ignore character casing
                                const floorA = a.floorsOwned;
                                const floorB = b.floorsOwned;

                                let comparison = 0;
                                if (floorA > floorB) {
                                    comparison = -1;
                                } else if (floorA < floorB) {
                                    comparison = 1;
                                }
                                return comparison;
                            }
                            userList.sort(compare);
                            let sortedList = "";
                            for (let index = 0; index < userList.length; index++) {
                                sortedList += `${userList[index].name} - ${userList[index].floorsOwned}\n`
                            }

                            const embed = new Discord.MessageEmbed()
                                .setTitle("DeltaBot Hotel Leaderboard")
                                .setDescription(sortedList)
                                .setTimestamp()
                                .setFooter(`Requested by: ${message.author.tag}`)
                            message.channel.send(embed)
                        });
                        break;
                    case "floors":
                    case "list":
                        dbInstance.collection("hotel").find({}).toArray(function (err, result) {
                            if (err) throw err;
                            let floorList = [];
                            result.forEach(element => {
                                floorList.push({ floor: element.floor, ownerName: element.ownerName })
                            });
                            function compare(a, b) {
                                // Use toUpperCase() to ignore character casing
                                const floorA = a.floor;
                                const floorB = b.floor;

                                let comparison = 0;
                                if (floorA > floorB) {
                                    comparison = -1;
                                } else if (floorA < floorB) {
                                    comparison = 1;
                                }
                                return comparison;
                            }
                            floorList.sort(compare);
                            let sortedList = "";
                            for (let index = 0; index < floorList.length; index++) {
                                sortedList += `${floorList[index].floor} - ${floorList[index].ownerName}\n`
                            }
                            db.close();
                            const embed = new Discord.MessageEmbed()
                                .setTitle("DeltaBot Hotel Floors")
                                .setDescription(sortedList)
                                .setTimestamp()
                                .setFooter(`Requested by: ${message.author.id}`)
                            message.channel.send(embed)
                        })
                        break;
                    default:
                        if (args.length == 1) {
                            if (!isNaN(args[0])) {
                                const getFloor = parseInt(args[0]);
                                const floorData = await dbInstance.collection("hotel").findOne({ floor: getFloor });
                                if (floorData != null) {
                                    const floorEmbed = new Discord.MessageEmbed()
                                        .setTitle(floorData.floorName)
                                        .setDescription(floorData.floorDescription)
                                        .setThumbnail(floorData.floorIcon)
                                        .addField("Floor:", floorData.floor, true)
                                        .addField("Owned by:", floorData.ownerName, true)
                                        .setTimestamp()
                                        .setFooter(`Requested by: ${message.author.tag}`)
                                    message.channel.send(floorEmbed)
                                } else {
                                    message.reply("that floor is not owned.")
                                }
                            }
                        }
                        break;
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle("How to use DeltaBot Hotel")
                    .setDescription(`Use \`!hotel buy [number]\` to buy an unowned floor.\n\nUse \`!hotel sell [number]\` to sell a floor you own.\n\nUse \`!hotel [number]\` to visit a floor.`)
                    .addField("Disclaimer", "Floors must contain appropriate information, if you are found to be using inappropriate information you will be banned from the hotel.")
                    .setTimestamp()
                    .setFooter(`Requested by: ${message.author.tag}`)
                message.channel.send(embed)
            }
        })
    },
};