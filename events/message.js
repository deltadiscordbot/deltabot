const Discord = require('discord.js');
const deltaDiscordID = "625714187078860810", altstoreDiscordID = "625766896230334465";
const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
    //TODO: Added cooldown so that there is only a message sent after 5 min of inactivity and add blocked channels/users.
    // if (message.author.bot || message.channel.type === 'dm' || message.content.startsWith(client.prefix)) return; //Bots don't deserve credits.
    // const allAlerts = await message.client.dbInstance.collection("alerts").find({}).toArray();
    // let dmsSent = []
    // allAlerts.forEach(userAlerts => {
    //     userAlerts.alerts.forEach(alert => {
    //         if (alert.server == message.guild.id) {
    //             alert.serveralerts.forEach(serveralerts => {
    //                 if (!dmsSent.includes(userAlerts.id)) {
    //                     if (message.content.toLowerCase().includes(serveralerts) && userAlerts.id != message.author.id && !alert.ignoredchannels.includes(message.channel.id) && !alert.ignoredusers.includes(message.author.id)) {
    //                         dmsSent.push(userAlerts.id)
    //                         userObject = message.client.users.cache.find(user => user.id === userAlerts.id)
    //                         const embed = new Discord.MessageEmbed()
    //                             .setDescription(`New message sent in **${message.guild.name}** by **${message.author.tag}**\n`)
    //                             .addField(`Message:`, `${message.content}\n[Jump to message](${message.url})`)
    //                             .setTimestamp()
    //                         userObject.send(embed)
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // });
    // if (message.guild.id == deltaDiscordID || message.guild.id == altstoreDiscordID) {
    //     const messageLog = await client.dbInstance.collection("logs").findOne({ channelid: message.channel.id });
    //     if (messageLog != null) {
    //         const newCount = messageLog.messageCount + 1;
    //         const myobj = { channelid: message.channel.id };
    //         const newvalues = { $set: { messageCount: newCount, lastmessage: Date.now() } };
    //         client.dbInstance.collection("logs").updateOne(myobj, newvalues, function (err, res) {
    //             if (err) throw err;
    //         });
    //     } else {
    //         var myobj = { channelid: message.channel.id, channelname: message.channel.name, guildID: message.guild.id, guildname: message.guild.name, messageCount: 1, lastmessage: Date.now() };
    //         client.dbInstance.collection("logs").insertOne(myobj, function (err, res) {
    //             if (err) throw err;
    //         });
    //     }
    // }

    // if (!cooldowns.has("lastMessage")) {
    //     cooldowns.set("lastMessage", new Discord.Collection());
    // }

    // const now = Date.now();
    // const timestamps = cooldowns.get('lastMessage');
    // const cooldownAmount = 60_000;

    // if (timestamps.has(message.author.id)) {
    //     const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    //     if (now < expirationTime) {
    //         return;
    //     }
    // }
    // timestamps.set(message.author.id, now);
    // setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    // setTimeout(async () => {
    //     try {
    //         const user = await client.dbInstance.collection("users").findOne({ id: message.author.id });
    //         if (user != null) {
    //             const randCredits = Math.floor(Math.random() * (100 - 10)) + 10;
    //             const newbalance = user.balance + randCredits;
    //             const newTotal = user.totalCredits + randCredits;
    //             let talkCredits = 0;
    //             if (user.talkCredits != undefined) {
    //                 talkCredits = user.talkCredits + randCredits;
    //             }
    //             const myobj = { id: message.author.id };
    //             const newvalues = { $set: { balance: newbalance, totalCredits: newTotal, talkCredits: talkCredits } };
    //             client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
    //                 if (err) throw err;
    //             });
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         message.reply('There was an error while trying to manage xp!');
    //     }
    // }, 1000);
};