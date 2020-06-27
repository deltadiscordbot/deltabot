const package = require('../package.json');
const Discord = require('discord.js');
module.exports = {
    name: 'tag',
    description: 'Commands to provide help.',
    usage: ['(tag name)'],
    cooldown: 1,
    guildOnly: true,
    needsdb: true,
    aliases: ['tags', 't'],
    async execute(message, args, dbInstance) {
        if (args.length) {
            const items = await dbInstance.collection("tags").findOne({ name: args.toString() });
            if (items == null) {
                const tags = await dbInstance.collection("tags").find({}).toArray();
                let data = "";
                let listCount = 0;
                tags.forEach(element => {
                    if (element.name.includes(args.toString())) {
                        data += element.name
                        listCount++;
                        if (listCount != tags.length) {
                            data += ", "
                        }
                    }
                });
                if (data == "") {
                    message.reply("no tags found.")
                        .then(msg => {
                            message.delete();
                            setTimeout(() => {
                                msg.delete();
                            }, 5000);
                        })
                } else {
                    const modEmbed = new Discord.MessageEmbed()
                        .setColor('#8A28F7')
                        .setTitle("Found tags:")
                        .setDescription(data.substring(0, data.length - 2))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                    message.channel.send(modEmbed);
                }
            } else {
                message.delete();
                message.channel.send(eval('`' + items.content + '`'))
            }
            return;
        } else {
            var listCount = 0;
            var data = '';
            dbInstance.collection("tags").find({}).toArray(function (err, result) {
                if (err) throw err;
                result.forEach(element => {
                    data += element.name;
                    listCount++;
                    if (listCount != result.length) {
                        data += ", "
                    }
                });
                const modEmbed = new Discord.MessageEmbed()
                    .setColor('#8A28F7')
                    .setTitle("Current tags:")
                    .setDescription(data)
                    .setTimestamp()
                    .setFooter(package.name + ' v. ' + package.version);
                message.channel.send(modEmbed);
            });
            return;
        }
    },
};