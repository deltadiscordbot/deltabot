const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = { method: "Get" };
module.exports = {
    name: 'joke',
    description: 'Gets a random joke.',
    category: "fun",
    guildOnly: true,
    async execute(message, args) {
        const jokeAPI = 'https://official-joke-api.appspot.com/random_joke';
        fetch(jokeAPI, settings)
            .then(res => res.json())
            .then((json) => {
                const embed = new Discord.MessageEmbed()
                .setDescription(`${json.setup}\n\n||${json.punchline}||`)
                .setFooter(`Requested by: ${message.author.tag} | Category: ${json.type} | ID: ${json.id}`)
                message.channel.send(embed)
            })
    },
};