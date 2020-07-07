const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const queue = new Map();
let { prefix } = require('./config.json');
const { projectId, mainSourceURL, alphaSourceURL, ownerID, /*twitterAPIKey, twitterAPISecret, twitterAccessSecret, twitterAccessToken,*/ token, mongodbase, currentdb, numbers, computers, devices, versions, altstoreAlerts, deltaAlerts } = require('./config.json');
const dialogflow = require('@google-cloud/dialogflow');
const package = require('./package.json');
const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');
require('log-timestamp')(function () { return new Date().toLocaleString() + ' "%s"' });
//const Twitter = require('twitter-lite');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();
let announceChannels = [], betaannounceChannels = [], supportchannels = [];
//let twitterchannels = [];
const betaRole = "<@&716483174028410962>";
const alphaRole = "<@&716483589692325900>";
const settings = { method: "Get" };
let databaseClient, altstoreApps, welcomechannelID, helperRoles, modRoles, logChannelID, oldClipBetaVersion, oldClipVersion, oldAltstoreVersion, oldDeltaVersion, oldAltstoreBetaVersion, oldAltstoreAlphaVersion, oldDeltaAlphaVersion, oldDeltaBetaVersion, appsList, newClipBetaVersion, newClipVersion, newAltstoreData, newDeltaData, newAltstoreVersion, newDeltaVersion, newAltstoreBetaVersion, newDeltaBetaVersion;
const consoles = [`DS games on Delta`, `N64 games on Delta`, `GBA games on Delta`, `GBC games on Delta`, `SNES games on Delta`, `NES games on Delta`];

// const twitterClient = new Twitter({
//     consumer_key: twitterAPIKey,
//     consumer_secret: twitterAPISecret,
//     access_token_key: twitterAccessToken,
//     access_token_secret: twitterAccessSecret,
// });
// const twitterParameters = {
//     follow: "1137807296778498048",
//     tweet_mode: "extended"
// };

function updateVersions() {
    fetch(mainSourceURL, settings)
        .then(res => res.json())
        .then((json) => {

            //sets activity to random Delta console
            const randomActivity = consoles[Math.floor(Math.random() * consoles.length)];
            client.user.setActivity(randomActivity + ` with ${client.users.cache.size} others!`, { type: 'PLAYING' });

            altstoreApps = json;
            for (var i = 0; i < altstoreApps['apps'].length; i++) {
                switch (altstoreApps['apps'][i].bundleIdentifier) {
                    case "com.rileytestut.AltStore":
                        newAltstoreData = altstoreApps['apps'][i];
                        break;
                    case "com.rileytestut.Delta":
                        newDeltaData = altstoreApps['apps'][i];
                        break;
                    case "com.rileytestut.AltStore.Beta":
                        newAltstoreBetaData = altstoreApps['apps'][i];
                        break;
                    case "com.rileytestut.Delta.Beta":
                        newDeltaBetaData = altstoreApps['apps'][i];
                        break;
                    case "com.rileytestut.Clip.Beta":
                        newClipBetaData = altstoreApps['apps'][i];
                        break;
                    case "com.rileytestut.Clip":
                        newClipData = altstoreApps['apps'][i];
                        break;

                    default:
                        break;
                }
            }
            newAltstoreVersion = newAltstoreData['version'];
            newDeltaVersion = newDeltaData['version'];
            newAltstoreBetaVersion = newAltstoreBetaData['version'];
            newDeltaBetaVersion = newDeltaBetaData['version'];
            newClipBetaVersion = newClipBetaData['version'];
            newClipVersion = newClipData['version'];


            //AltStore
            if (newAltstoreVersion != oldAltstoreVersion) {
                appsList[0] = newAltstoreVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#018084')
                        .setThumbnail(newAltstoreData['iconURL'])
                        .setTitle("New AltStore update!")
                        .addField("Version:", `${oldAltstoreVersion} -> ${newAltstoreVersion}`, true)
                        .addField("What's new:", newAltstoreData['versionDescription'].substring(0, 1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    announceChannels.forEach(element => {
                        element.send(modEmbed);
                    });
                })
            }
            //AltStore Beta
            if (newAltstoreBetaVersion != oldAltstoreBetaVersion) {
                appsList[2] = newAltstoreBetaVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#018084')
                        .setThumbnail(newAltstoreBetaData['iconURL'])
                        .setTitle("New AltStore Beta update!")
                        .addField("Version:", `${oldAltstoreBetaVersion} -> ${newAltstoreBetaVersion}`, true)
                        .addField("What's new:", newAltstoreBetaData['versionDescription'].substring(0, 1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    betaannounceChannels.forEach(element => {
                        element.send(betaRole)
                            .then(msg => {
                                msg.edit(modEmbed);
                            })
                    });
                })
            }
            //Delta
            if (newDeltaVersion != oldDeltaVersion) {
                appsList[1] = newDeltaVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#8A28F7')
                        .setThumbnail(newDeltaData['iconURL'])
                        .setTitle("New Delta update!")
                        .addField("Version:", `${oldDeltaVersion} -> ${newDeltaVersion}`, true)
                        .addField("What's new:", newDeltaData['versionDescription'].substring(0, 1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    announceChannels.forEach(element => {
                        element.send(modEmbed);
                    });

                });
            }
            //Delta Beta
            if (newDeltaBetaVersion != oldDeltaBetaVersion) {
                appsList[3] = newDeltaBetaVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#8A28F7')
                        .setThumbnail(newDeltaBetaData['iconURL'])
                        .setTitle("New Delta Beta update!")
                        .addField("Version:", `${oldDeltaBetaVersion} -> ${newDeltaBetaVersion}`, true)
                        .addField("What's new:", newDeltaBetaData['versionDescription'].substring(0, 1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    betaannounceChannels.forEach(element => {
                        element.send(betaRole)
                            .then(msg => {
                                msg.edit(modEmbed);
                            })
                    });
                });
            }
            //clip Beta
            if (newClipBetaVersion != oldClipBetaVersion) {
                appsList[6] = newClipBetaVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#EC008C')
                        .setThumbnail(newClipBetaData['iconURL'])
                        .setTitle("New Clip Beta update!")
                        .addField("Version:", `${oldClipBetaVersion} -> ${newClipBetaVersion}`, true)
                        .addField("What's new:", newClipBetaData['versionDescription'].substring(0, 1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    betaannounceChannels.forEach(element => {
                        element.send(betaRole)
                            .then(msg => {
                                msg.edit(modEmbed);
                            })
                    });
                });
            }
            //clip 
            if (newClipVersion != oldClipVersion) {
                appsList[7] = newClipVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#EC008C')
                        .setThumbnail(newClipData['iconURL'])
                        .setTitle("New Clip update!")
                        .addField("Version:", `${oldClipVersion} -> ${newClipVersion}`, true)
                        .addField("What's new:", newClipData['versionDescription'].substring(0, 1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    announceChannels.forEach(element => {
                        element.send(modEmbed);
                    });
                });
            }
        });

    fetch(alphaSourceURL, settings)
        .then(res => res.json())
        .then((json) => {
            var altstoreApps = json;
            for (var i = 0; i < altstoreApps['apps'].length; i++) {
                switch (altstoreApps['apps'][i].bundleIdentifier) {
                    case "com.rileytestut.AltStore.Alpha":
                        newAltstoreData = altstoreApps['apps'][i];
                        break;
                    case "com.rileytestut.Delta.Alpha":
                        newDeltaData = altstoreApps['apps'][i];
                    default:
                        break;
                }
            }
            newAltstoreVersion = newAltstoreData['version'];
            newDeltaVersion = newDeltaData['version'];

            //AltStore Alpha
            if (newAltstoreVersion != oldAltstoreAlphaVersion) {
                appsList[4] = newAltstoreVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#018084')
                        .setThumbnail(newAltstoreData['iconURL'])
                        .setTitle("New AltStore Alpha update!")
                        .addField("Version:", `${oldAltstoreAlphaVersion} -> ${newAltstoreVersion}`, true)
                        .addField("What's new:", newAltstoreData['versionDescription'].substring(0, 1024))
                        .addField("Add source:", alphaSourceURL)
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    betaannounceChannels.forEach(element => {
                        element.send(alphaRole)
                            .then(msg => {
                                msg.edit(modEmbed);
                            })
                    });
                })
            }
            //Delta Alpha
            if (newDeltaVersion != oldDeltaAlphaVersion) {
                appsList[5] = newDeltaVersion;
                var myquery = { name: "versions" };
                var newvalue = { $set: { apps: appsList } };
                client.dbInstance.collection("data").updateOne(myquery, newvalue, function (err, res) {
                    if (err) throw err;
                    updateVars();
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#8A28F7')
                        .setThumbnail(newDeltaData['iconURL'])
                        .setTitle("New Delta Alpha update!")
                        .addField("Version:", `${oldDeltaAlphaVersion} -> ${newDeltaVersion}`, true)
                        .addField("What's new:", newDeltaData['versionDescription'].substring(0, 1024))
                        .addField("Add source:", alphaSourceURL)
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    betaannounceChannels.forEach(element => {
                        element.send(alphaRole)
                            .then(msg => {
                                msg.edit(modEmbed);
                            })
                    });
                });
            }
        });
};
async function updateVars() {
    const dataItems = await client.dbInstance.collection('data').findOne({});
    appsList = dataItems.apps;
    // appsList 0-altstore, 1-delta, 2-beta altstore, 3-beta delta, 4-alpha altstore, 5-alpha delta, 6-clip beta, 7-clip
    oldAltstoreVersion = appsList[0];
    oldDeltaVersion = appsList[1];
    oldAltstoreBetaVersion = appsList[2];
    oldDeltaBetaVersion = appsList[3];
    oldAltstoreAlphaVersion = appsList[4];
    oldDeltaAlphaVersion = appsList[5];
    oldClipBetaVersion = appsList[6];
    oldClipVersion = appsList[7];
    const items = await client.dbInstance.collection('config').findOne({});
    prefix = items.prefix;
    welcomechannelID = items.welcomechannel;
    modRoles = items.modroles;
    helperRoles = items.helperroles;
    logChannelID = items.logchannel;
    var index = 0;
    items.announcechannel.forEach(element => {
        announceChannels[index] = client.channels.cache.get(element);
        index++;
    });
    index = 0;
    items.betaannouncechannel.forEach(element => {
        betaannounceChannels[index] = client.channels.cache.get(element);
        index++;
    });
    index = 0;
    items.supportchannels.forEach(element => {
        supportchannels[index] = client.channels.cache.get(element);
        index++;
    });
    // index = 0;
    // items.twitterchannel.forEach(element => {
    //     twitterchannels[index] = client.channels.cache.get(element);
    //     index++;
    // });
}

async function exeCommand(command, message, args) {
    if (command.needsqueue) {
        if (message.channel.name == "delta-bot" || message.channel.name == "music" || message.author.id == ownerID || message.channel.name == "bot-commands") {
            await command.execute(message, args, queue);
        }
    } else {
        await command.execute(message, args);
    }
    if (command.updatedb) {
        await updateVars();
    }
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}
const deltaDiscordID = "625714187078860810", altstoreDiscordID = "625766896230334465";
let deltaDiscord, altstoreDiscord, deltaRoleChannel, altstoreRoleChannel;


client.once('ready', async () => {
    databaseClient = await MongoClient.connect(mongodbase, {
        useUnifiedTopology: true,
    });
    client.dbInstance = databaseClient.db(currentdb)
    updateVars();
    updateVersions();
    setInterval(updateVersions, 60000);
    console.log('Ready!');
    deltaDiscord = client.guilds.cache.get(deltaDiscordID)
    altstoreDiscord = client.guilds.cache.get(altstoreDiscordID);
    initReactionRoles();
});

function initReactionRoles() {
    deltaRoleChannel = client.channels.cache.get("719296628904951819");
    deltaRoleChannel.messages.fetch("719312071992279242") //computers in delta
        .then(computerMessage => {
            createRR(computerMessage, computers);
        });
    deltaRoleChannel.messages.fetch("719312073040855061") //versions in delta
        .then(versionMessage => {
            createRR(versionMessage, versions);
        });
    deltaRoleChannel.messages.fetch("719312126702780516") //devices in delta
        .then(deviceMessage => {
            createRR(deviceMessage, devices);
        });
    /* deltaRoleChannel.messages.fetch("722562577669816431") //alerts in delta
        .then(alertsMessage => {
            createRR(alertsMessage, deltaAlerts);
        }); */

    altstoreRoleChannel = client.channels.cache.get("719294939451621377");
    altstoreRoleChannel.messages.fetch("719296388311285861") //computers in altstore
        .then(computerMessage => {
            createRR(computerMessage, computers);
        });
    altstoreRoleChannel.messages.fetch("719296390009978880") //versions in altstore
        .then(versionMessage => {
            createRR(versionMessage, versions);
        });
    altstoreRoleChannel.messages.fetch("719296390358106153") //devices in altstore
        .then(deviceMessage => {
            createRR(deviceMessage, devices);
        });
    altstoreRoleChannel.messages.fetch("722562517901115494") //alerts in altstore
        .then(alertsMessage => {
            createRR(alertsMessage, altstoreAlerts);
        });
}
function createRR(message, array) {
    let embedBody = "";
    for (let index = 0; index < array.length; index++) {
        embedBody += `${numbers[index]} ${array[index]}\n\n`
    }
    let currentEmbed = new Discord.MessageEmbed()
        .setDescription(embedBody);
    message.edit(currentEmbed)
    let currentFilter = [];
    let currentCollector = [];
    for (let index = 0; index < array.length; index++) {
        let role = message.guild.roles.cache.find(x => x.name == array[index]);
        if (!role) {
            message.guild.roles.create({
                data: {
                    name: array[index],
                }
            })
                .catch(console.error);
        }
        message.react(numbers[index]);
        currentFilter[index] = (reaction, user) => reaction.emoji.name === numbers[index] && user.id != message.author.id;
        currentCollector[index] = message.createReactionCollector(currentFilter[index], { dispose: true });
    }
    currentCollector.forEach(element => {
        element.on("collect", (r, u) => {
            const member = message.guild.member(u);
            const role = message.guild.roles.cache.find(role => role.name === array[numbers.indexOf(r.emoji.name.toString())]);
            if (!member.roles.cache.some(role => role.name === array[numbers.indexOf(r.emoji.name.toString())])) {
                member.roles.add(role);
            }
        })
        element.on("remove", (r, u) => {
            const member = message.guild.member(u);
            const role = message.guild.roles.cache.find(role => role.name === array[numbers.indexOf(r.emoji.name.toString())]);
            if (member.roles.cache.some(role => role.name === array[numbers.indexOf(r.emoji.name.toString())])) {
                member.roles.remove(role);
            }
        })
    });
}

/* twitterClient.stream("statuses/filter", twitterParameters)
    .on("start", response => console.log("twitter stream started"))
    .on("data", tweet => {
        if (tweet.in_reply_to_status_id == null && tweet.retweet_count == 0 && tweet.user.screen_name == "altstoreio") {
            twitterchannels.forEach(element => {
                element.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
            });
        }
    })
    .on("error", error => console.log("error", error))
    .on("end", response => console.log("twitter stream ended"));
 */

async function detectIntent(
    projectId,
    sessionId,
    query,
    languageCode
) {
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };

    const responses = await sessionClient.detectIntent(request);
    return responses[0];
}

//This event listener handles all messages and gives credits to users
client.on('message', async message => {
    if (message.author.bot || message.channel.type === 'dm') return; //Bots don't deserve credits.
    if (message.guild.id == deltaDiscordID || message.guild.id == altstoreDiscordID) {
        const messageLog = await client.dbInstance.collection("logs").findOne({ channelid: message.channel.id });
        if (messageLog != null) {
            const newCount = messageLog.messageCount + 1;
            const myobj = { channelid: message.channel.id };
            const newvalues = { $set: { messageCount: newCount, lastmessage: Date.now() } };
            client.dbInstance.collection("logs").updateOne(myobj, newvalues, function (err, res) {
                if (err) throw err;
            });
        } else {
            var myobj = { channelid: message.channel.id, channelname: message.channel.name, guildID: message.guild.id, guildname: message.guild.name, messageCount: 1, lastmessage: Date.now() };
            client.dbInstance.collection("logs").insertOne(myobj, function (err, res) {
                if (err) throw err;
            });
        }
    }

    if (!cooldowns.has("lastMessage")) {
        cooldowns.set("lastMessage", new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get('lastMessage');
    const cooldownAmount = 60_000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            return;
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    setTimeout(async () => {
        try {
            const user = await client.dbInstance.collection("users").findOne({ id: message.author.id });
            if (user == null) {
                return;
            } else {
                const randCredits = Math.floor(Math.random() * (100 - 10)) + 10;
                const newbalance = user.balance + randCredits;
                const newTotal = user.totalCredits + randCredits;
                let talkCredits = 0;
                if (user.talkCredits != undefined) {
                    talkCredits = user.talkCredits + randCredits;
                }
                const myobj = { id: message.author.id };
                const newvalues = { $set: { balance: newbalance, totalCredits: newTotal, talkCredits: talkCredits } };
                client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
                    if (err) throw err;
                    return;
                });
            }
        } catch (error) {
            console.error(error);
            message.reply('There was an error while trying to manage xp!');
        }
    }, 1000);
})


//This event listener handles all bot commands
client.on('message', message => {
    if (!(message.content.startsWith(prefix) || message.mentions.users.first() == client.user) || message.author.bot) return;
    var args;
    if (message.content.startsWith(prefix)) {
        args = message.content.slice(prefix.length).split(/ +/);
    } else {
        args = message.content.slice(prefix.length).split(/ +/).slice(1);
    }
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (message.author.id != ownerID) {
        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                    .then(msg => {
                        setTimeout(function () {
                            msg.delete();
                        }, 5000);
                    });
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    try {
        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('I can\'t execute that command inside DMs!');
        }
        if (command.args && !args.length) {
            const commandhelp = client.commands.get("help");
            const argshelp = [command.name];
            commandhelp.execute(message, argshelp)
        } else {
            if (command.needshelper) {
                let isHelper = false;
                if (message.author.id == ownerID) {
                    isHelper = true;
                }
                modRoles.forEach(element => {
                    if (message.member.roles.cache.has(element) || message.member.hasPermission(['ADMINISTRATOR'])) {
                        isHelper = true;

                    }
                    if (isHelper) {
                        return
                    };
                });
                helperRoles.forEach(element => {
                    if (message.member.roles.cache.has(element) || message.member.hasPermission(['ADMINISTRATOR'])) {
                        isHelper = true;
                    }
                    if (isHelper) {
                        return
                    };
                })
                if (!isHelper) {
                    return;
                } else {
                    exeCommand(command, message, args);
                }
            } else if (command.needsmod) {
                let isMod = false;
                if (message.author.id == ownerID) {
                    isMod = true;
                }
                modRoles.forEach(element => {
                    if (message.member.roles.cache.has(element) || message.member.hasPermission(['ADMINISTRATOR'])) {
                        isMod = true;
                    }
                    if (isMod) return;
                });
                if (!isMod) {
                    return;
                } else {
                    exeCommand(command, message, args);
                }
            } else if (command.needsadmin) {
                if (message.member.hasPermission(['ADMINISTRATOR']) || message.author.id == ownerID) {
                    exeCommand(command, message, args);
                    return;
                } else {
                }
            } else if (command.needsowner) {
                if (message.author.id == ownerID) {
                    exeCommand(command, message, args);
                    return;
                }
            } else {
                exeCommand(command, message, args);
            }
        }
    }

    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

//AI helper
client.on('message', async message => {
    let isMod = false, isHelper = false;
    modRoles.forEach(element => {
        if (message.member.roles.cache.has(element) || message.member.hasPermission(['ADMINISTRATOR'])) {
            isMod = true;
        }
    })
    helperRoles.forEach(element => {
        if (message.member.roles.cache.has(element)) {
            isHelper = true;
        }
    })
    if (!supportchannels.includes(message.channel) || message.content.length < 20 || message.author.bot || message.content.startsWith(prefix) || ((supportchannels.includes(message.channel) && message.channel.name != "delta-bot") && (isHelper || isMod))) return;
    const sessionID = Math.floor(1000000 + Math.random() * 9000000).toString();
    const result = await (await detectIntent(projectId, sessionID, message.content, "en-US")).queryResult;
    console.log(result["intentDetectionConfidence"])
    if (parseFloat(result["intentDetectionConfidence"]) > .70 && result["fulfillmentText"].length > 1) {
        const items = await client.dbInstance.collection("tags").findOne({ name: result["fulfillmentText"].toString() });
        if (items != null) message.channel.send(eval('`' + items.content + '`'));
    }
})

//Join message
client.on('guildMemberAdd', async member => {
    // AltStore Discord
    if (member.guild.id == "625766896230334465") {
        let deltaMember, role;
        async () => {
            try {
                deltaMember = await deltaDiscord.members.cache.get(member.user.id);
            } catch (error) {
                console.log(error)
            }
            role = await deltaDiscord.roles.cache.find(role => role.id === '626544956567322656');
        }
        if (deltaMember != undefined) {
            if (!deltaMember.roles.cache.some(role => role.id === '626544956567322656')) {
                deltaMember.roles.add(role);
            };
        }
    } else if (member.guild.id == "625714187078860810") {
        //Delta Discord
        let altMember, role;
        async () => {
            try {
                altMember = await altstoreDiscord.members.cache.get(member.user.id);
            } catch (error) {
                console.log(error)
            }
            role = await deltaDiscord.roles.cache.find(role => role.id === '626544956567322656')
        }
        if (altMember != undefined) {
            if (!member.roles.cache.some(role => role.id === '626544956567322656')) {
                member.roles.add(role);
            }
        }
    }
});

//Deleted message
/* client.on('messageDelete', message => {
    if (message.channel.type === 'dm') return;
    let logchannel = message.guild.channels.cache.get(logChannelID);
    if (!logchannel) return;
 
    const modEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setAuthor(message.author.tag, message.author.avatarURL())
        .addField("Message deleted:", message.content)
        .addField("Channel:", message.channel)
        .setTimestamp()
        .setFooter(`Sender ID: ${message.author.id}`)
    logchannel.send(modEmbed);
})
 
//edited message
client.on('messageUpdate', function (oldMessage, newMessage) {
    if (oldMessage.channel.type === 'dm') return;
    if (oldMessage.content.length && newMessage.content.length) {
        let logchannel = newMessage.guild.channels.cache.get(logChannelID);
        if (!logchannel) return;
 
        const modEmbed = new Discord.MessageEmbed()
            .setColor('#ffff00')
            .setAuthor(newMessage.author.tag, newMessage.author.avatarURL())
            .setDescription(`Message edited in ${newMessage.channel} [Jump to message](${newMessage.url})`)
            .addField("Before:", oldMessage.content, true)
            .addField("After:", newMessage.content, true)
            .setTimestamp()
            .setFooter(`Sender ID: ${newMessage.author.id}`)
        logchannel.send(modEmbed);
    }
})
 
//banned member
client.on('guildBanAdd', async function (guild, user) {
    let logchannel = guild.channels.cache.get(logChannelID);
    const banList = await guild.fetchBan(user.id);
    if (!logchannel) return;
 
    const modEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle("Ban")
        .addField("User banned:", user.tag, true)
        .addField("Reason:", banList.reason, true)
        .setTimestamp()
        .setFooter(`User ID: ${user.id}`)
    logchannel.send(modEmbed);
})
 
//leave log
client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    let logchannel = member.guild.channels.cache.get(logChannelID);
    // Do nothing if the channel wasn't found on this server
    if (!logchannel) return;
    if (!member.bannable) return;
    // Send the message, mentioning the member
    const modEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTitle("Member Left")
        .setAuthor(member.user.tag, member.user.avatarURL())
        .addField("Left at:", member.joinedAt.toDateString() + ", " + member.joinedAt.toLocaleTimeString('en-US'))
        .setTimestamp()
        .setFooter(`User ID: ${member.user.id}`)
    logchannel.send(modEmbed);
});
 
//unbanned member
client.on('guildBanRemove', async function (guild, user) {
    let logchannel = guild.channels.cache.get(logChannelID);
    if (!logchannel) return;
 
    guild.fetchAuditLogs()
        .then(audit => {
            const modEmbed = new Discord.MessageEmbed()
                .setColor('#32CD32')
                .setTitle("Unban")
                .addField("User unbanned:", user.tag, true)
                .addField("Reason:", audit.entries.first().reason, true)
                .setTimestamp()
                .setFooter(`User ID: ${user.id}`)
            logchannel.send(modEmbed);
        });
})
 
//deleted channel
client.on('channelDelete', channel => {
    if (channel.type === 'dm') return;
    let logchannel = channel.guild.channels.cache.get(logChannelID);
    if (!logchannel) return;
 
    channel.guild.fetchAuditLogs()
        .then(audit => {
            const modEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle("Channel Deleted")
                .addField("Channel:", channel.name, true)
                .addField("Category:", channel.parent, true)
                .addField("User:", audit.entries.first().executor, true)
                .setTimestamp()
            logchannel.send(modEmbed);
        });
}) */

client.login(token);
