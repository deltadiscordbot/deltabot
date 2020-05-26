const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 5,
    needsclient: true,
    async execute(message, args,client) {

       //message.channel.send('Pong! in `' + `${Date.now() - message.createdTimestamp}` + 'ms`');
       const m = await message.channel.send("Ping?");
       m.edit(`Pong! Latency is \`${m.createdTimestamp - message.createdTimestamp}ms\`. API Latency is \`${client.ws.ping}ms\``);
       },
};