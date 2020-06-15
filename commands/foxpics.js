const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = { method: "Get", headers: { 'Accept': 'application/json', } };
module.exports = {
    name: 'foxpics',
    description: 'Get a random picture of a fox!',
    category: "fun",
    guildOnly: true,
    aliases: ['fox', 'foxes'],
    async execute(message, args) {
            const dogAPI = 'https://randomfox.ca/floof/?ref=apilist.fun';
            fetch(dogAPI, settings)
                .then(res => res.json())
                .then((json) => {
                    const embed = new Discord.MessageEmbed()
                        .setImage(`${json.image}`)
                        .setFooter(`Requested by: ${message.author.tag}`)
                    message.channel.send(embed)
                })
    },
};