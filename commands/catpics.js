const {catAPIKey} = require('../config.json');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const settings = {
    method: "Get",
    headers: {
		'Accept': 'application/json',
		'x-api-key': catAPIKey
    }
};
module.exports = {
    name: 'catpics',
    description: 'Get a picture of a cat. You can even specify a breed.',
    usage: "[optionalBreed]",
    aliases: ['cat', 'cats', 'catto', 'cattos', 'kitty', 'kitties', 'kitten', 'kittens'],
    guildOnly: true,
    async execute(message, args) {
		//Check the user has specified a breed
		if (args[0]){
			//First search the breed to get it's id before continuing.
			const breedSearchApi = `https://api.thecatapi.com/v1/breeds/search?q=${args[0]}`;
			fetch(breedSearchApi, settings)
				.then(res => res.json())
				.then((json) => {
					//If the breed couldn't be found, tell the user
					if(!json.length) return message.channel.send("That breed couldn't be found");
					const breedId = json[0].id;
					const catRandomPicApi = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
					//Now search for a random picture using the breed id
					fetch(catRandomPicApi, settings)
						.then(res => res.json())		
						.then((json) => {
							const embed = new Discord.MessageEmbed()
							.setImage(`${json[0].url}`)
							.setFooter(`Requested by: ${message.author.tag}`)
							message.channel.send(embed)
						})
				})
		} else {
			const catRandomPicApi = 'https://api.thecatapi.com/v1/images/search'
			fetch(catRandomPicApi, settings)
				.then(res => res.json())
				.then((json) => {
					const embed = new Discord.MessageEmbed()
					.setImage(`${json[0].url}`)
					.setFooter(`Requested by: ${message.author.tag}`)
					message.channel.send(embed)
				});
		}
    }
}
