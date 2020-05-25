const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = { method: "Get" };
let sourceApps = [];
let embedInfo = "";
module.exports = {
    name: 'source',
    description: 'Lists apps from a source.',
    cooldown: 3,
    args: true,
    async execute(message, args) {
        sourceApps = [];
        if (args.length == 1){
            fetch(args[0], settings)
            .then(res => res.json())
            .then((json) => {
                json['apps'].forEach(element => {
                    sourceApps.push(element)
                });
                embedInfo = "";
                sourceApps.forEach(element => {
                    if (element['beta']){
                        embedInfo += `[**${element['name']}**](${element['downloadURL']}) *beta* ${element['version']} \n`

                    }else {
                        embedInfo += `[**${element['name']}**](${element['downloadURL']}) ${element['version']} \n`
                    }
                });
                const exampleEmbed = new Discord.MessageEmbed()
                .setTitle(json.name)
                .setURL(args[0])
                .setDescription(embedInfo.substring(0,2048))
                .setTimestamp()
                .setFooter('Requested by: ' + message.author.tag);
            
                message.channel.send(exampleEmbed);
            
            })
            .catch(err => {
                message.reply("invalid source.")
            });    
        } else {
            message.reply("please enter only one source.")
        }
    },
};