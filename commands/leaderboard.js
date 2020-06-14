const Discord = require('discord.js');
var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
module.exports = {
    name: 'leaderboard',
    description: 'Top credit earners.',
    guildOnly: true,
    category: "eco",
    aliases: ['top'],
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
            if (err) throw err;
            dbInstance = db.db(currentdb);
            dbInstance.collection("users").find({}).toArray(function (err, result) {
                if (err) throw err;
                let userList = [];

                result.forEach(element => {
                    if (element.totalCredits != undefined && element.name != undefined) {
                        userList.push({ name: element.name, totalCredits: element.totalCredits })
                    }
                });
                function compare(a, b) {
                    // Use toUpperCase() to ignore character casing
                    const totalA = a.totalCredits;
                    const totalB = b.totalCredits;

                    let comparison = 0;
                    if (totalA > totalB) {
                        comparison = -1;
                    } else if (totalA < totalB) {
                        comparison = 1;
                    }
                    return comparison;
                }
                userList.sort(compare);
                userList = userList.splice(0, 10)
                let sortedList = "";
                for (let index = 0; index < userList.length; index++) {
                    sortedList += `${userList[index].name} - ${userList[index].totalCredits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n`
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle("Top Credit Earners")
                    .setDescription(sortedList)
                    .setTimestamp()
                    .setFooter(`Requested by: ${message.author.tag}`)
                message.channel.send(embed)
                db.close();
            });

        });


    },
};