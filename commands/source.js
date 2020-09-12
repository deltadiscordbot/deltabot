const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = { method: "Get" };
let sourceApps = [];
let embedInfo = "";
let index = 1;
module.exports = {
    name: 'source',
    description: 'Displays apps from a source.',
    usage: "(SourceURL)",
    cooldown: 30,
    args: true,
    guildOnly: true,
    async execute(message, args) {
        sourceApps = [];
        if (args.length == 1) {
            fetch(args[0], settings)
                .then(res => res.json())
                .then((json) => {
                    json['apps'].forEach(element => {
                        sourceApps.push(element)
                    });
                    embedInfo = [];
                    var currentDate;
                    embedInfo[0] = '';
                    embedIndex = 0, embedLength = 0, totalapps = 1;
                    for (let index = 0; index < sourceApps.length; index++) {
                        currentDate = new Date(sourceApps[index]['versionDate']);
                        if (sourceApps[index]['beta']) {
                            embedInfo[embedIndex] += `${totalapps}. [**${sourceApps[index]['name']}**](https://delta-skins.github.io/appinstall.html?altstore://install?url=${sourceApps[index]['downloadURL']}) *beta* ${sourceApps[index]['version']}\n`
                        } else {
                            embedInfo[embedIndex] += `${totalapps}. [**${sourceApps[index]['name']}**](https://delta-skins.github.io/appinstall.html?altstore://install?url=${sourceApps[index]['downloadURL']}) ${sourceApps[index]['version']}\n`
                        }
                        totalapps++;
                        embedLength++;
                        if (embedLength >= 10) {
                            embedLength = 0;
                            embedIndex++;
                            embedInfo[embedIndex] = '';
                        }
                    }
                    let appListEmbedArray = [];
                    let activeIndex = 0;
                    for (let index = 0; index < embedInfo.length; index++) {
                        appListEmbedArray[index] = new Discord.MessageEmbed()
                            .setTitle(json.name)
                            .setURL(args[0])
                            .setDescription(embedInfo[index].substring(0, 2048))
                            .setFooter(`Type a number to view app info | Page ${index + 1}/${embedInfo.length}`);
                    }

                    let sourceAppsLength = [];
                    index = 1;
                    sourceApps.forEach(element => {
                        sourceAppsLength.push(index);
                        index++;
                    });
                    message.channel.send(appListEmbedArray[activeIndex]).then((async msg => {
                        msg.react("◀️");
                        msg.react("▶️");
                        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id;
                        const forwardsFilter = (reaction, user) => reaction.emoji.name === '▶️' && user.id === message.author.id;
                        const backwards = msg.createReactionCollector(backwardsFilter, { timer: 1000, idle: 15000, dispose: true });
                        const forwards = msg.createReactionCollector(forwardsFilter, { timer: 1000, idle: 15000, dispose: true });
                        backwards.on('collect', r => {
                            if (activeIndex == 0) {
                                activeIndex = (appListEmbedArray.length - 1);
                            } else {
                                activeIndex--
                            }
                            msg.edit(appListEmbedArray[activeIndex])
                            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                            try {
                                for (const reaction of userReactions.values()) {
                                    reaction.users.remove(message.author.id);
                                }
                            } catch (error) {
                                console.error('Failed to remove reactions.');
                            }
                        })

                        forwards.on('collect', async r => {
                            if (activeIndex === (appListEmbedArray.length - 1)) {
                                activeIndex = 0;
                            } else {
                                activeIndex++;
                            }
                            msg.edit(appListEmbedArray[activeIndex])

                            const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                            try {
                                for (const reaction of userReactions.values()) {
                                    reaction.users.remove(message.author.id);
                                }
                            } catch (error) {
                                console.error('Failed to remove reactions.');
                            }
                        })

                        const collector = message.channel.createMessageCollector(m => (sourceAppsLength.includes(parseInt(m.content)) && m.author.id == message.author.id), { time: 15000 });
                        collector.on('collect', async m => {
                            m.delete();
                            const selcetedApp = json['apps'][(parseInt(m) - 1)];
                            const appDate = await new Date(selcetedApp.versionDate.toString());
                            function formatBytes(a, b = 2) { if (0 === a) return "0 Bytes"; const c = 0 > b ? 0 : b, d = Math.floor(Math.log(a) / Math.log(1024)); return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d] }
                            collector.resetTimer()
                            const selectedAppEmbed = new Discord.MessageEmbed()
                                .setTitle(selcetedApp.name)
                                .setAuthor(selcetedApp.developerName)
                                .setColor(selcetedApp.tintColor)
                                .setThumbnail(selcetedApp.iconURL)
                                .setDescription(selcetedApp.localizedDescription.substring(0, 2048))
                                .addField("Version:", selcetedApp.version, true)
                                .addField("Updated:", `${(appDate.getMonth() + 1)}/${appDate.getDate()}/${appDate.getFullYear()}`, true)
                                .addField("Size:", formatBytes(selcetedApp.size), true)
                                .addField("Download:", `[Direct install](https://delta-skins.github.io/appinstall.html?altstore://install?url=${selcetedApp.downloadURL})\n[Download IPA](${selcetedApp.downloadURL})`, true)
                                .addField("What's new:", selcetedApp.versionDescription.substring(0, 1024))
                                .setImage(selcetedApp.screenshotURLs[0])
                                .setTimestamp()
                                .setFooter('Requested by: ' + message.author.tag);
                            msg.edit(selectedAppEmbed).then((msg2 => {
                                const backwardsFilter = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;
                                const goBack = msg.createReactionCollector(backwardsFilter, { timer: 1000, idle: 30000, dispose: true });

                                msg.reactions.removeAll().then(msg.react("⏪"));
                                goBack.on('collect', r => {
                                    collector.resetTimer()
                                    msg.edit(appListEmbedArray[activeIndex]);
                                    msg.reactions.removeAll();
                                    msg.react("◀️");
                                    msg.react("▶️");
                                });
                                goBack.on('end'), e => {
                                    msg.reactions.removeAll();
                                }
                            }));
                        });

                        collector.on('end', collected => {
                            msg.reactions.removeAll();
                        });

                    }));
                })
                .catch(err => {
                    message.reply("invalid source.")
                });
        } else {
            message.reply("please enter only one source.")
        }
    },
};