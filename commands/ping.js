const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'ping',
    description: 'pong!',
    cooldown: 5,
    async execute(message, args) {

        //message.channel.send('Pong! in `' + `${Date.now() - message.createdTimestamp}` + 'ms`');
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is \`${m.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${message.client.ws.ping}ms\``);
    },
};