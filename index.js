const fs = require('fs');
const Discord = require('discord.js');
var dbInstance;
var welcomechannelID;
const { token, mongodbase, currentdb } = require('./config.json');
var {prefix} = require('./config.json');
var MongoClient = require('mongodb').MongoClient;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();
var modRoles;
var logChannelID;

function updateVars(){
    MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {            
        if(err) throw err;
            dbInstance = db.db(currentdb);
            const items = await dbInstance.collection('config').findOne({});
            prefix = items.prefix;
            welcomechannelID = items.welcomechannel;
            modRoles = items.modroles;
            logChannelID = items.logchannel;
            db.close();
        });
}

function exeCommand(command,message,args){
    if (command.needsclient){
        command.execute(message,args,client);
    } else {
    command.execute(message, args);
    }
    if (command.updatedb) {
        updateVars();
    }
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setActivity('DS games on Delta', { type: 'PLAYING' });
    console.log('Ready!');
    updateVars();
});

client.on('message', message => {
    if (!(message.content.startsWith(prefix) || message.mentions.users.first() == client.user) || message.author.bot) return;
    var args;
    if (message.content.startsWith(prefix)){
        args = message.content.slice(prefix.length).split(/ +/);
    } else {
        args = message.content.slice(prefix.length).split(/ +/).slice(1);   
    }
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
    
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
		return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
	}
    }

try {
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }
    if (command.args && !args.length) {
        const commandhelp = client.commands.get("help");
        const argshelp = [command.name];     
        commandhelp.execute(message, argshelp)
    } else {
        if (command.needsmod) {
            var isMod = false;
            if (message.author.id == "253330909313499136") {
                isMod = true;
            }
            modRoles.forEach(element => {
                if (message.member.roles.cache.has(element) || message.member.hasPermission(['ADMINISTRATOR'])){
                    isMod = true;
                }
                if (isMod) return;
            });
                if (!isMod) {
                    message.channel.send("You need to be mod to use this command.");
                    return;
                } else {
                    exeCommand(command,message,args);   
                }
        } else if (command.needsadmin) {
                if (message.member.hasPermission(['ADMINISTRATOR'])){
                    exeCommand(command,message,args); 
                    return; 
                } else {
                    message.channel.send("You need to be admin to use this command.");
                }        
        }  else {
            exeCommand(command,message,args); 
        }
    }
}

catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
}
});  

//Join message
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.get(welcomechannelID);
    let logchannel = member.guild.channels.cache.get(logChannelID);
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    if (!logchannel) return;

    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
    const modEmbed = new Discord.MessageEmbed()
                .setColor('#32CD32')
                .setTitle("Member Joined")
                .setAuthor(member.user.tag,member.user.avatarURL())
                .addField("Joined at:",member.joinedAt.toDateString() + ", " + member.joinedAt.toLocaleTimeString('en-US'))
                .addField("User created:",member.user.createdAt.toDateString() + ", " + member.user.createdAt.toLocaleTimeString('en-US'))
                .setTimestamp()
                .setFooter(`User ID: ${member.user.id}`)
                  logchannel.send(modEmbed);
  });

//Deleted message
client.on('messageDelete', message => {
    if (message.channel.type === 'dm') return;
    let logchannel = message.guild.channels.cache.get(logChannelID);
    if (!logchannel) return;

    const modEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setAuthor(message.author.tag,message.author.avatarURL())
                .addField("Message deleted:",message.content)
                .addField("Channel:",message.channel)
                .setTimestamp()
                .setFooter(`Sender ID: ${message.author.id}`)
                  logchannel.send(modEmbed);
})

//edited message
client.on('messageUpdate', function(oldMessage,newMessage){
    if (oldMessage.channel.type === 'dm') return;
    if(oldMessage.content.length && newMessage.content.length){
    let logchannel = newMessage.guild.channels.cache.get(logChannelID);
    if (!logchannel) return;

    const modEmbed = new Discord.MessageEmbed()
                .setColor('#ffff00')
                .setAuthor(newMessage.author.tag,newMessage.author.avatarURL())
                .setDescription(`Message edited in ${newMessage.channel} [Jump to message](${newMessage.url})`)
                .addField("Before:",oldMessage.content,true)
                .addField("After:",newMessage.content,true)
                .setTimestamp()
                .setFooter(`Sender ID: ${newMessage.author.id}`)
                logchannel.send(modEmbed);
    }
})

//banned member
client.on('guildBanAdd', async function(guild,user){
    let logchannel = guild.channels.cache.get(logChannelID);
    const banList = await guild.fetchBan(user.id);
    if (!logchannel) return;

    const modEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle("Ban")
                .addField("User banned:",user.tag,true)
                .addField("Reason:",banList.reason,true)
                .setTimestamp()
                .setFooter(`User ID: ${user.id}`)
                logchannel.send(modEmbed);
})

//leave log
client.on('guildMemberRemove', member => {
    // Send the message to a designated channel on a server:
    let logchannel = member.guild.channels.cache.get(logChannelID);
    // Do nothing if the channel wasn't found on this server
    if (!logchannel) return;
    if (!member.bannable) return;
    // Send the message, mentioning the member
    const modEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle("Member Left")
                .setAuthor(member.user.tag,member.user.avatarURL())
                .addField("Left at:",member.joinedAt.toDateString() + ", " + member.joinedAt.toLocaleTimeString('en-US'))
                .setTimestamp()
                .setFooter(`User ID: ${member.user.id}`)
                  logchannel.send(modEmbed);
  });
  
//unbanned member
client.on('guildBanRemove', async function(guild,user){
    let logchannel = guild.channels.cache.get(logChannelID);
    if (!logchannel) return;

    guild.fetchAuditLogs()
    .then(audit => {
        const modEmbed = new Discord.MessageEmbed()
                .setColor('#32CD32')
                .setTitle("Unban")
                .addField("User unbanned:",user.tag,true)
                .addField("Reason:",audit.entries.first().reason,true)
                .setTimestamp()
                .setFooter(`User ID: ${user.id}`)
                logchannel.send(modEmbed);       
    });
})

//deleted channel
client.on('channelDelete', channel => {
    if (channel.type === 'dm') return;
    let logchannel = channel.guild.channels.cache.get(logChannelID);
    if (!logchannel) return;

    channel.guild.fetchAuditLogs()
    .then(audit => {
        const modEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle("Channel Deleted")
                .addField("Channel:",channel.name,true)
                .addField("Category:",channel.parent,true)
                .addField("User:",audit.entries.first().executor,true)
                .setTimestamp()
                logchannel.send(modEmbed);       
    });
})

client.login(token);