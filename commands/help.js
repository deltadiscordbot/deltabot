var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
var dbInstance;
const package = require('../package.json');
var prefix = "!";
const Discord = require('discord.js');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(message, args) {
        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {            
            if(err) throw err;
                dbInstance = db.db(currentdb);
                const items = await dbInstance.collection('config').findOne({});
                prefix = await items.prefix;
                db.close();
            });
        const data = [];
        const { commands } = message.client;
        var currentString = '';
		if (!args.length) {
            for (let elem of commands.entries()){
                currentString = currentString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
            }
            currentString = currentString + `\n\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`;
        data.push(currentString);

        const helpEmbed = new Discord.MessageEmbed()
        .setColor('#32CD32')
        .setTitle("Here\'s a list of all my commands:")
        .setDescription(data)
        .setTimestamp()
        .setFooter(package.name + ' v. ' + package.version);

//data.push(commands.map(command => command.name).join(' \n'));

return message.author.send(helpEmbed)
    .then(() => {
        if (message.channel.type === 'dm') return;
        message.reply('I\'ve sent you a DM with all my commands!');
    })
    .catch(error => {
        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
        message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
    });
		}

		const name = args[0].toLowerCase();
const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

if (!command) {
    return message.reply('that\'s not a valid command!');
}

data.push(`**Name:** ${command.name}`);

if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
if (command.description) data.push(`**Description:** ${command.description}`);
if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

message.channel.send(data, { split: true });
	},
};