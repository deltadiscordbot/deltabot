const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = { method: "Get", headers: { 'Accept': 'application/json', } };
module.exports = {
    name: 'dogpics',
    description: 'Get a random picture of a dog!',
    category: "fun",
    guildOnly: true,
    aliases: ['dog', 'dogs'],
    async execute(message, args) {
        if (args.length) {
            const dogAPI = `https://dog.ceo/api/breed/${args[0].toString()}/images/random/`;
            fetch(dogAPI, settings)
                .then(res => res.json())
                .then((json) => {
                    if (json.status != 'error') {
                        const embed = new Discord.MessageEmbed()
                            .setImage(`${json.message}`)
                            .setFooter(`Requested by: ${message.author.tag}`)
                        message.channel.send(embed)
                    } else { message.reply("invalid breed.") }
                })
        } else {
            const dogAPI = 'https://dog.ceo/api/breeds/image/random/';
            fetch(dogAPI, settings)
                .then(res => res.json())
                .then((json) => {
                    const embed = new Discord.MessageEmbed()
                        .setImage(`${json.message}`)
                        .setFooter(`Requested by: ${message.author.tag}`)
                    message.channel.send(embed)
                })
        }
    },
};