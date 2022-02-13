const package = require('../../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'alert',
    description: 'Sets alert words.',
    guildOnly: true,
    aliases: ['alerts'],
    async execute(message, args) {
        let channels = "", users = "";
        const user = await message.client.dbInstance.collection("alerts").findOne({ id: message.author.id });
        console.log(user)
        if (args.length) {
            switch (args[0]) {
                case "add":
                case "create":
                    if (user == null) {
                        //If server doesn't have alerts
                        let alertList = [];
                        alertList.push({ server: message.guild.id, serveralerts: [args[1].toString().toLowerCase()] })
                        var myobj = { id: message.author.id, name: message.author.tag, alerts: alertList };
                        return message.author.send(`Alerts have been enabled.`)
                            .then(() => {
                                if (message.channel.type === 'dm') return;
                                message.client.dbInstance.collection("alerts").insertOne(myobj, function (err, res) {
                                    if (err) throw err;
                                });
                                message.reply(`added alert ${args[1].toString().toLowerCase()}.`);
                            })
                            .catch(error => {
                                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                            });
                    } else {
                        let serverIndex;
                        for (let index = 0; index < user.alerts.length; index++) {
                            if (user.alerts[index].server == message.guild.id) {
                                serverIndex = index;
                            }
                        }
                        if (user.alerts[serverIndex] != undefined) {
                            //If server has alerts
                            if (user.alerts[serverIndex].serveralerts.includes(args[1].toString().toLowerCase())) {
                                //If alert exists for server, delete it
                                message.reply(`alert already exists.`);
                            } else {
                                //If alert doesn't exist for server, add it
                                let currentAlerts = user.alerts;
                                currentAlerts[serverIndex].serveralerts.push(args[1].toString().toLowerCase())
                                const myobj = { id: message.author.id };
                                const newvalues = {
                                    $set: { alerts: currentAlerts }
                                };
                                message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                    if (err) throw err;
                                    message.reply(`added alert ${args[1].toString().toLowerCase()}.`);
                                });
                            }
                        } else {
                            let currentAlerts = user.alerts;
                            currentAlerts.push({ server: message.guild.id, serveralerts: [args[1].toString().toLowerCase()] })
                            const myobj = { id: message.author.id };
                            const newvalues = {
                                $set: { alerts: currentAlerts }
                            };
                            message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                if (err) throw err;
                                message.reply(`added alert ${args[1].toString().toLowerCase()}.`);
                            });
                        }
                    }
                    break;
                case "remove":
                case "delete":
                    if (user == null) {
                        message.reply("you do not have any alerts set.")
                        return;
                    } else {
                        let serverIndex;
                        for (let index = 0; index < user.alerts.length; index++) {
                            if (user.alerts[index].server == message.guild.id) {
                                serverIndex = index;
                            }
                        }
                        if (user.alerts[serverIndex] != undefined) {
                            //If server has alerts
                            if (user.alerts[serverIndex].serveralerts.includes(args[1].toString().toLowerCase())) {
                                //If alert exists for server, delete it
                                let currentAlerts = user.alerts;
                                currentAlerts[serverIndex].serveralerts.splice(currentAlerts[serverIndex].serveralerts.indexOf(args[1].toString().toLowerCase()), 1)
                                const myobj = { id: message.author.id };
                                const newvalues = { $set: { alerts: currentAlerts } };
                                message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                    if (err) throw err;
                                    message.reply(`removed alert ${args[1].toString().toLowerCase()}.`);
                                });
                            } else {
                                //If alert doesn't exist for server
                                message.reply(`that alert does not exist.`);
                            }
                        } else {
                            //If server doesn't exist for user
                            message.reply(`that alert does not exist.`);
                        }
                    }
                    break;
                case "ignore":
                    if (user == null) {
                        message.reply("you do not have any alerts set.")
                        return;
                    } else {
                        let ignoreObject, isChannel = false;
                        args.shift();

                        if (args.length) {
                            if (message.mentions.channels.size) {
                                ignoreObject = message.mentions.channels.first();
                                isChannel = true;
                            } else {
                                if (message.mentions.users.size) {
                                    ignoreObject = message.mentions.users.first()
                                } else if (message.client.users.cache.find(user => user.id === args[0].toString())) {
                                    ignoreObject = message.client.users.cache.find(user => user.id === args[0].toString())
                                } else if (message.client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())) {
                                    ignoreObject = message.client.users.cache.find(user => user.username.toLowerCase() === args.join(" ").toString().toLowerCase())
                                } else {
                                    message.reply("please specifiy a user or channel.")
                                }
                            }
                            let serverIndex;
                            for (let index = 0; index < user.alerts.length; index++) {
                                if (user.alerts[index].server == message.guild.id) {
                                    serverIndex = index;
                                }
                            }
                            if (user.alerts[serverIndex] != undefined) {
                                let currentIgnored;
                                if (isChannel) {
                                    if (user.alerts[serverIndex].ignoredchannels != null) {
                                        if (!user.alerts[serverIndex].ignoredchannels.includes(ignoreObject.id)) {
                                            currentIgnored = user.alerts;
                                            currentIgnored[serverIndex].ignoredchannels.push(ignoreObject.id);
                                            const myobj = { id: message.author.id };
                                            const newvalues = { $set: { alerts: currentIgnored } };
                                            message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                                if (err) throw err;
                                                message.reply(`added ${ignoreObject} to ignored.`);
                                            });
                                        } else {
                                            currentIgnored = user.alerts;
                                            currentIgnored[serverIndex].ignoredchannels.splice(currentIgnored[serverIndex].ignoredchannels.indexOf(args[0].toString().toLowerCase()), 1)
                                            const myobj = { id: message.author.id };
                                            const newvalues = { $set: { alerts: currentIgnored } };
                                            message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                                if (err) throw err;
                                                message.reply(`removed ${ignoreObject}.`);
                                            });
                                        }
                                    } else {
                                        currentIgnored = user.alerts;
                                        let ignoreList = [];
                                        ignoreList.push(ignoreObject.id)
                                        currentIgnored[serverIndex].ignoredchannels = ignoreList;
                                        const myobj = { id: message.author.id };
                                        const newvalues = { $set: { alerts: currentIgnored } };
                                        message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                            if (err) throw err;
                                            message.reply(`added ${ignoreObject} to ignored.`);
                                        });
                                    }

                                } else {
                                    if (user.alerts[serverIndex].ignoredusers != null) {
                                        if (!user.alerts[serverIndex].ignoredusers.includes(ignoreObject.id)) {
                                            currentIgnored = user.alerts;
                                            currentIgnored[serverIndex].ignoredusers.push(ignoreObject.id);
                                            const myobj = { id: message.author.id };
                                            const newvalues = { $set: { alerts: currentIgnored } };
                                            message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                                if (err) throw err;
                                                message.reply(`added ${ignoreObject} to ignored.`);
                                            });
                                        } else {
                                            currentIgnored = user.alerts;
                                            currentIgnored[serverIndex].ignoredusers.splice(currentIgnored[serverIndex].ignoredusers.indexOf(args[0].toString().toLowerCase()), 1)
                                            const myobj = { id: message.author.id };
                                            const newvalues = { $set: { alerts: currentIgnored } };
                                            message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                                if (err) throw err;
                                                message.reply(`removed ${ignoreObject}.`);
                                            });
                                        }
                                    } else {
                                        currentIgnored = user.alerts;
                                        let ignoreList = [];
                                        ignoreList.push(ignoreObject.id)
                                        currentIgnored[serverIndex].ignoredusers = ignoreList;
                                        const myobj = { id: message.author.id };
                                        const newvalues = { $set: { alerts: currentIgnored } };
                                        message.client.dbInstance.collection("alerts").updateOne(myobj, newvalues, function (err, res) {
                                            if (err) throw err;
                                            message.reply(`added ${ignoreObject} to ignored.`);
                                        });
                                    }
                                }
                            } else {
                                message.reply("there are no alerts set.")
                            }
                        } else {
                            currentIgnored = user.alerts;
                            let serverIndex;
                            for (let index = 0; index < user.alerts.length; index++) {
                                if (user.alerts[index].server == message.guild.id) {
                                    serverIndex = index;
                                }
                            }
                            let listCount = 0;
                            if (user.alerts[serverIndex] != undefined) {
                                if (user.alerts[serverIndex].ignoredchannels != null) {
                                    await user.alerts[serverIndex].ignoredchannels.forEach(async element => {
                                        const channel = await message.client.channels.fetch(element);
                                        console.log(channel)
                                        channels = channels + `${channel}`;
                                        listCount++;
                                        if (listCount != user.alerts[serverIndex].ignoredchannels.length) {
                                            channels += ", "
                                        }
                                    });
                                }
                                if (user.alerts[serverIndex].ignoredusers != undefined) {
                                    listCount = 0;
                                    await user.alerts[serverIndex].ignoredusers.forEach(async element => {
                                        const cUser = await message.client.users.cache.find(user => user.id === element).toString();
                                        users = users + cUser;
                                        listCount++;
                                        if (listCount != user.alerts[serverIndex].ignoredusers.length) {
                                            users += ", "
                                        }
                                    });
                                }
                                if (!channels.length) {
                                    channels = "None"
                                }
                                if (!users.length) {
                                    users = "None"
                                }
                                const embed = new Discord.MessageEmbed()
                                    .addField("Ignored channels:", channels, true)
                                    .addField("Ignored users:", users, true)
                                    .setTimestamp()
                                message.channel.send(embed)
                            } else { message.reply("there are no alerts set.") }
                        }
                    }
                    break;
                default:
                    const embed = new Discord.MessageEmbed()
                        .setTitle("How to use alerts.")
                        .setDescription(`\`!alert add [alertword]\` to add an alert.\n\`!alert remove [alertword]\` to remove an alert.\n\`!alert ignore [channel or user]\` to blacklist a channel or user.`)
                    message.reply(embed)
                    break;
            }
        } else {
            if (user != null) {
                let serverIndex;
                for (let index = 0; index < user.alerts.length; index++) {
                    if (user.alerts[index].server == message.guild.id) {
                        serverIndex = index;
                    }
                }
                var listCount = 0;
                var data = '';
                if (user != null && user.alerts[serverIndex] != undefined && user.alerts[serverIndex].serveralerts.length > 0) {
                    user.alerts[serverIndex].serveralerts.forEach(element => {
                        data += element;
                        listCount++;
                        if (listCount != user.alerts[serverIndex].serveralerts.length) {
                            data += ", "
                        }
                    });
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#8A28F7')
                        .setTitle("Current alerts:")
                        .setDescription(data)
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    message.channel.send(modEmbed);
                    return;
                } else {
                    message.reply("you do not have any alerts set.")
                }
            } else {
                message.reply("you do not have any alerts set.")
            }
        }
    },
};