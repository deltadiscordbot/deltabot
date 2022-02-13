const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = { method: "Get", headers: {'Accept': 'application/json',}};
module.exports = {
    name: 'dadjoke',
    description: 'Gets a random dad joke.',
    category: "fun",
    guildOnly: true,
    async execute(message, args) {
        const jokeAPI = 'https://icanhazdadjoke.com/';
        fetch(jokeAPI, settings)
            .then(res => res.json())
            .then((json) => {
                const embed = new Discord.MessageEmbed()
                .setDescription(`${json.joke}`)
                .setFooter(`Requested by: ${message.author.tag} | ID: ${json.id}`)
                message.channel.send(embed)
            })
    },
};