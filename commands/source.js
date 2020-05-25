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
    cooldown: 3,
    args: true,
    needsclient:true,
    async execute(message, args,client) {
        sourceApps = [];
        if (args.length == 1){
            fetch(args[0], settings)
            .then(res => res.json())
            .then((json) => {
                json['apps'].forEach(element => {
                    sourceApps.push(element)
                });
                embedInfo = "";
                index = 1;
                sourceApps.forEach(element => {
                    if (element['beta']){
                        embedInfo += `${index}. [**${element['name']}**](${element['downloadURL']}) *beta* ${element['version']} \n`
                    }else {
                        embedInfo += `${index}. [**${element['name']}**](${element['downloadURL']}) ${element['version']} \n`
                    }
                    index++;
                });
                const appListEmbed = new Discord.MessageEmbed()
                .setTitle(json.name)
                .setURL(args[0])
                .setDescription(embedInfo.substring(0,2048))
                .setTimestamp()
                .setFooter('Requested by: ' + message.author.tag);
                let sourceAppsLength = [];
                index = 1;
                sourceApps.forEach(element => {
                    sourceAppsLength.push(index);
                    index++;
                });
                message.channel.send(appListEmbed).then((msg =>
            {
                msg.react("⌛")
                const collector = message.channel.createMessageCollector(m => (sourceAppsLength.includes(parseInt(m.content)) && m.author.id == message.author.id), { time: 15000 });
                collector.on('collect', m => {
                    m.delete();
                    console.log(m)
                    const selcetedApp = json['apps'][(parseInt(m) - 1)];
                    function formatBytes(a,b=2){if(0===a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]}
                    collector.resetTimer()
                    const selectedAppEmbed = new Discord.MessageEmbed()
                    .setTitle(selcetedApp.name)
                    .setAuthor(selcetedApp.developerName)
                    .setColor(selcetedApp.tintColor)
                    .setThumbnail(selcetedApp.iconURL)
                    .setURL(selcetedApp.downloadURL)
                    .setDescription(selcetedApp.localizedDescription.substring(0,2048))
                    .addField("Version:", selcetedApp.version,true)
                    .addField("Size:",formatBytes(selcetedApp.size),true)
                    .addField("What's new:",selcetedApp.versionDescription.substring(0,1024))
                    .setImage(selcetedApp.screenshotURLs[0])
                    .setTimestamp()
                    .setFooter('Requested by: ' + message.author.tag);
                    msg.edit(selectedAppEmbed).then((msg2 => {
                        const backwardsFilter = (reaction, user) => reaction.emoji.name === '◀️' && user.id === message.author.id;
                        const backwards = msg.createReactionCollector(backwardsFilter, {timer: 1000,idle: 10000, dispose:true});

                        msg.reactions.removeAll();
                        msg.react("◀️")
                        backwards.on('collect', r => {
                            collector.resetTimer()
                            msg.edit(appListEmbed);
                            msg.reactions.removeAll();
                            msg.react("⌛")
                            });
                        backwards.on('end'), e => {
                            console.log("ended")
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