const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {
    name: 'ping',
    description: 'Ping!',
    cooldown: 3,
    execute(message, args) {

       message.channel.send('Pong! in `' + `${Date.now() - message.createdTimestamp}` + 'ms`');
        //message.channel.send("My Ping: " + Math.round(client.ping) + ' ms');
       /* message.channel.send('${Math.round(client.ping)}');
        async function ping(message) {
        var resMsg = await message.channel.send('Pinging... <a:loading:597979197780000774>');
        resMsg.edit('Ping: `' + Math.round((resMsg.createdTimestamp - message.createdTimestamp) - ${Math.round(client.ping)}) + "`");
    }
    ping(message);*/
    },
};