const package = require('../package.json');
var prefix = "!";
const Discord = require('discord.js');
module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,

    async execute(message, args) {
        const items = await message.client.dbInstance.collection('config').findOne({});
        prefix = await items.prefix;
        const { commands } = message.client;
        let currentString = '';
        let modString = '';
        let adminString = '';
        let funString = '';
        let ecoString = '';
        let musicString = '';
        let ownerString = '';
        if (!args.length) {
            for (let elem of commands.entries()) {
                switch (elem[1].category) {
                    case "mod":
                        modString = modString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
                        break;
                    case "admin":
                        adminString = adminString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
                        break;
                    case "owner":
                        ownerString = ownerString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
                        break;
                    case "fun":
                        funString = funString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
                        break;
                    case "eco":
                        ecoString = ecoString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
                        break;
                    case "music":
                        musicString = musicString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
                        break;
                    default:
                        currentString = currentString + `\`${prefix}` + elem[1].name + "` - " + elem[1].description + "\n";
                        break;
                }
            }
            ownerString = ownerString + `\n\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`;

            //TODO: Create multipage help command to fix embed limits.

            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#8A28F7')
                .setTitle("Here\'s a list of all my commands:")
                .setDescription(currentString)
                .addField("Fun commands:", funString)
                .addField("Music commands:", musicString)
                .addField("Economy commands:", ecoString)
                .addField("Mod commands:", modString)
                .addField("Admin commands:", adminString)
                .addField("Owner commands:", ownerString)
                .setTimestamp()
                .setFooter(package.name + ' v. ' + package.version);

            //data.push(commands.map(command => command.name).join(' \n'));

            return message.author.send(helpEmbed)
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.react('✅');
                })
                .catch(error => {
                    console.log(error)
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }
        const data = [];
        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        message.channel.send(data, { split: true });

    },
};