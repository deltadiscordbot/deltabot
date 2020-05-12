const fs = require('fs');
const Discord = require('discord.js');
var dbInstance;
var welcomechannelID;
const { token, mongodbase, currentdb } = require('./config.json');
var {prefix} = require('./config.json');
const package = require('./package.json');
var MongoClient = require('mongodb').MongoClient;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();
var modRoles;
var logChannelID;
var announceChannels = [];
var betaannounceChannels = [];
const fetch = require('node-fetch');
let mainSourceURL = "https://cdn.altstore.io/file/altstore/apps.json";
let alphaSourceURL = "https://f000.backblazeb2.com/file/altstore/sources/alpha/apps-alpha.json";
let settings = { method: "Get" };
var oldAltstoreVersion;
var oldDeltaVersion;
var oldAltstoreBetaVersion;
var oldAltstoreBetaVersion;
var oldAltstoreAlphaVersion;
var oldDeltaAlphaVersion;
var oldDeltaBetaVersion;
var appsList;
var newAltstoreData;
var newDeltaData;
var newAltstoreVersion;
var newDeltaVersion;
var newAltstoreBetaVersion;
var newDeltaBetaVersion;

function updateVersions(){
fetch(mainSourceURL, settings)
    .then(res => res.json())
    .then((json) => {
        // do something with JSON
        var altstoreApps = json;
        for (var i = 0; i < altstoreApps['apps'].length; i++){
            // look for the entry with a matching `bundleID` value
            if (altstoreApps['apps'][i].bundleIdentifier == "com.rileytestut.AltStore"){
               // we found AltStore
              newAltstoreData = altstoreApps['apps'][i];
            }
            if (altstoreApps['apps'][i].bundleIdentifier == "com.rileytestut.Delta"){
                // we found Delta
               newDeltaData = altstoreApps['apps'][i];
             } 
             if (altstoreApps['apps'][i].bundleIdentifier == "com.rileytestut.AltStore.Beta"){
                // we found Delta
               newAltstoreBetaData = altstoreApps['apps'][i];
             }
             if (altstoreApps['apps'][i].bundleIdentifier == "com.rileytestut.Delta.Beta"){
                // we found Delta
               newDeltaBetaData = altstoreApps['apps'][i];
             }
          }
        newAltstoreVersion = newAltstoreData['version'];
        newDeltaVersion = newDeltaData['version'];
        newAltstoreBetaVersion = newAltstoreBetaData['version'];
        newDeltaBetaVersion = newDeltaBetaData['version'];

        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, function (err, db) {            
            if(err) throw err;
            dbInstance = db.db(currentdb);
            //newDeltaVersion = "1.0" //testing
            //newAltstoreVersion = "1.0" //testing
            //newAltstoreBetaVersion = "4.0" //testing
            //newDeltaBetaVersion = "3.0" //testing

                //AltStore
                if (newAltstoreVersion != oldAltstoreVersion){
                    appsList[0] = newAltstoreVersion;
                    var myquery = { name: "versions"};
                    var newvalue = { $set: {apps: appsList } };  
                    dbInstance.collection("data").updateOne(myquery, newvalue, function(err, res) {
                      if (err) throw err;
                        updateVars();
                        const modEmbed = new Discord.MessageEmbed()
                        .setColor('#018084')
                        .setThumbnail(newAltstoreData['iconURL'])
                        .setTitle("New AltStore update!")
                        .addField("Version:",`${oldAltstoreVersion} -> ${newAltstoreVersion}`,true)
                        .addField("What's new:",newAltstoreData['versionDescription'].substring(0,1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                        announceChannels.forEach(element => {
                            element.send(modEmbed);
                        });  
                    })
                }
                //AltStore Beta
                if (newAltstoreBetaVersion != oldAltstoreBetaVersion){
                    appsList[2] = newAltstoreBetaVersion;
                    var myquery = { name: "versions"};
                    var newvalue = { $set: {apps: appsList } };  
                    dbInstance.collection("data").updateOne(myquery, newvalue, function(err, res) {
                      if (err) throw err;
                        updateVars();
                        const modEmbed = new Discord.MessageEmbed()
                        .setColor('#018084')
                        .setThumbnail(newAltstoreBetaData['iconURL'])
                        .setTitle("New AltStore Beta update!")
                        .addField("Version:",`${oldAltstoreBetaVersion} -> ${newAltstoreBetaVersion}`,true)
                        .addField("What's new:",newAltstoreBetaData['versionDescription'].substring(0,1024))
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                        betaannounceChannels.forEach(element => {
                            element.send(modEmbed);
                        });  
                    })
                }
                //Delta
                if (newDeltaVersion != oldDeltaVersion){
                    appsList[1] = newDeltaVersion;
                    var myquery = { name: "versions"};
                    var newvalue = { $set: {apps: appsList } };  
                    dbInstance.collection("data").updateOne(myquery, newvalue, function(err, res) {
                      if (err) throw err;
                      updateVars();
                      const modEmbed = new Discord.MessageEmbed()
                      .setColor('#8A28F7')
                      .setThumbnail(newDeltaData['iconURL'])
                      .setTitle("New Delta update!")
                      .addField("Version:",`${oldDeltaVersion} -> ${newDeltaVersion}`,true)
                      .addField("What's new:",newDeltaData['versionDescription'].substring(0,1024))
                      .setTimestamp()
                      .setFooter(package.name + ' v. ' + package.version);
                        announceChannels.forEach(element => {
                            element.send(modEmbed);
                        });  

                    });
                }
                //Delta Beta
                if (newDeltaBetaVersion != oldDeltaBetaVersion){
                    appsList[3] = newDeltaBetaVersion;
                    var myquery = { name: "versions"};
                    var newvalue = { $set: {apps: appsList } };  
                    dbInstance.collection("data").updateOne(myquery, newvalue, function(err, res) {
                      if (err) throw err;
                      updateVars();
                      const modEmbed = new Discord.MessageEmbed()
                      .setColor('#8A28F7')
                      .setThumbnail(newDeltaBetaData['iconURL'])
                      .setTitle("New Delta Beta update!")
                      .addField("Version:",`${oldDeltaBetaVersion} -> ${newDeltaBetaVersion}`,true)
                      .addField("What's new:",newDeltaBetaData['versionDescription'].substring(0,1024))
                      .setTimestamp()
                      .setFooter(package.name + ' v. ' + package.version);
                        betaannounceChannels.forEach(element => {
                            element.send(modEmbed);
                        });  

                    });
                }
            });
    
    });

    fetch(alphaSourceURL, settings)
    .then(res => res.json())
    .then((json) => {
        var altstoreApps = json;
        for (var i = 0; i < altstoreApps['apps'].length; i++){
            // look for the entry with a matching `bundleID` value
            if (altstoreApps['apps'][i].bundleIdentifier == "com.rileytestut.AltStore.Alpha"){
               // we found AltStore
              newAltstoreData = altstoreApps['apps'][i];
            }
            if (altstoreApps['apps'][i].bundleIdentifier == "com.rileytestut.Delta.Alpha"){
                // we found Delta
               newDeltaData = altstoreApps['apps'][i];
             } 
          }
        newAltstoreVersion = newAltstoreData['version'];
        newDeltaVersion = newDeltaData['version'];

        MongoClient.connect(mongodbase, { useUnifiedTopology: true }, function (err, db) {            
            if(err) throw err;
                dbInstance = db.db(currentdb);
                //newAltstoreVersion = "1.0" //testing
                //AltStore Alpha
                if (newAltstoreVersion != oldAltstoreAlphaVersion){
                    appsList[4] = newAltstoreVersion;
                    var myquery = { name: "versions"};
                    var newvalue = { $set: {apps: appsList } };  
                    dbInstance.collection("data").updateOne(myquery, newvalue, function(err, res) {
                      if (err) throw err;
                        updateVars();
                        const modEmbed = new Discord.MessageEmbed()
                        .setColor('#018084')
                        .setThumbnail(newAltstoreData['iconURL'])
                        .setTitle("New AltStore Alpha update!")
                        .addField("Version:",`${oldAltstoreAlphaVersion} -> ${newAltstoreVersion}`,true)
                        .addField("What's new:",newAltstoreData['versionDescription'])
                        .setTimestamp()
                        .setFooter(package.name + ' v. ' + package.version);
                        betaannounceChannels.forEach(element => {
                            element.send(modEmbed);
                        });  
                    })
                }
                //Delta Alpha
                if (newDeltaVersion != oldDeltaAlphaVersion){
                    appsList[5] = newDeltaVersion;
                    var myquery = { name: "versions"};
                    var newvalue = { $set: {apps: appsList } };  
                    dbInstance.collection("data").updateOne(myquery, newvalue, function(err, res) {
                      if (err) throw err;
                      updateVars();
                      const modEmbed = new Discord.MessageEmbed()
                      .setColor('#8A28F7')
                      .setThumbnail(newDeltaData['iconURL'])
                      .setTitle("New Delta Alpha update!")
                      .addField("Version:",`${oldDeltaAlphaVersion} -> ${newDeltaVersion}`,true)
                      .addField("What's new:",newDeltaData['versionDescription'])
                      .setTimestamp()
                      .setFooter(package.name + ' v. ' + package.version);
                        betaannounceChannels.forEach(element => {
                            element.send(modEmbed);
                        });  

                    });
                }
            });
    
    });
};
function updateVars(){
    MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {            
        if(err) throw err;
        dbInstance = db.db(currentdb);
        const dataItems = await dbInstance.collection('data').findOne({});
        appsList = dataItems.apps;
        //appsList 0-altstore, 1-delta, 2-beta altstore, 3-beta delta, 4-alpha altstore, 5-alpha delta
        oldAltstoreVersion = appsList[0];
        oldDeltaVersion = appsList[1];
        oldAltstoreBetaVersion = appsList[2];
        oldDeltaBetaVersion = appsList[3];
        oldAltstoreAlphaVersion = appsList[4];
        oldDeltaAlphaVersion = appsList[5];
        const items = await dbInstance.collection('config').findOne({});
        prefix = items.prefix;
        welcomechannelID = items.welcomechannel;
        modRoles = items.modroles;
        logChannelID = items.logchannel;
        var index = 0;
        items.announcechannel.forEach(element => {
            announceChannels[index] = client.channels.cache.get(element);
            index++;
        });
        index = 0;
        items.betaannouncechannel.forEach(element => {
            betaannounceChannels[index] = client.channels.cache.get(element);
            index++;
        });
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
    updateVersions();
    setInterval(updateVersions, 60*1000);
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
                if (message.member.hasPermission(['ADMINISTRATOR']) || message.author.id == "253330909313499136"){
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