const ytdl = require('ytdl-core');
const Youtube = require('simple-youtube-api');
const Discord = require('discord.js');
const { youtubeAPIKey } = require('../config.json');
const youtube = new Youtube(youtubeAPIKey);
module.exports = {
    name: 'play',
    description: 'Plays a song.',
    category: "music",
    guildOnly: true,
    cooldown: 10,
    needsqueue: true,
    aliases: ['p'],
    async execute(message, args2, queue) {
        serverQueue = await queue.get(message.guild.id);
        const args = message.content.split(" ");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.reply(
                "You need to be in a voice channel to play music!"
            );
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.reply(
                "I need the permissions to join and speak in your voice channel!"
            );
        }
        async function getURL() {
            if (message.content.includes("www.youtube.com" || "youtu.be")) {
                return ytdl.getInfo(args[1]);
            } else {
                try {
                    const playMessage = await message.channel.send(`Searching... <a:loading:718190657579253782>`)
                    // search for the song and get 5 results back
                    args.shift()
                    const videos = await youtube.searchVideos(args, 5);
                    if (videos.length < 5) {
                        return message.say(
                            `I had some trouble finding what you were looking for, please try again or be more specific`
                        );
                    }
                    const vidNameArr = [];
                    const vidInfoArr = [];
                    // create an array that contains the result titles
                    for (let i = 0; i < videos.length; i++) {
                        vidInfoArr.push(await ytdl.getInfo(`https://www.youtube.com/watch?v=${videos[i].id}`));
                        vidNameArr.push(`${videos[i].title} - ${getLength(vidInfoArr[i].length_seconds)}`);
                    }
                    vidNameArr.push('exit'); // push 'exit' string as it will be an option
                    // create and display an embed which will present the user the 5 results
                    // so he can choose his desired result
                    const embed = new Discord.MessageEmbed()
                        .setColor('#e9f931')
                        .setTitle('Choose a song by commenting a number between 1 and 5')
                        .addField('Song 1', vidNameArr[0])
                        .addField('Song 2', vidNameArr[1])
                        .addField('Song 3', vidNameArr[2])
                        .addField('Song 4', vidNameArr[3])
                        .addField('Song 5', vidNameArr[4])
                        .addField('Exit', 'exit'); // user can reply with 'exit' if none matches
                    playMessage.edit("Search results:")
                    playMessage.edit({ embed });
                    try {
                        // wait 1 minute for the user's response
                        var response = await message.channel.awaitMessages(
                            msg => (((msg.content > 0 && msg.content < 6) || msg.content === 'exit') && message.author.id == msg.author.id),
                            {
                                max: 1,
                                maxProcessed: 1,
                                time: 60000,
                                errors: ['time']
                            }
                        );
                        // assign videoIndex to user's response
                        var videoIndex = parseInt(response.first().content);
                    } catch (err) {
                        console.error(err);
                        playMessage.delete();
                        return message.channel.send(
                            'Please try again and enter a number between 1 and 5 or exit'
                        );
                    }
                    // if the user responded with 'exit', cancel the command
                    playMessage.delete();
                    response.delete();
                    if (response.first().content === 'exit') return;
                    return ytdl.getInfo(`https://www.youtube.com/watch?v=${videos[videoIndex - 1].id}`);
                } catch (err) {
                    // if something went wrong when calling the api:
                    console.error(err);
                    if (playMessage) {
                        playMessage.delete();
                    }
                    return message.say(
                        'Something went wrong with searching the video you requested :('
                    );
                }
            }
        }
        if (
            args[1].match(
                /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
            )
        ) {
            try {
                const playlist = await youtube.getPlaylist(args[1]); // get playlist data 
                const videosObj = await playlist.getVideos(); // songs data object
                //const videos = Object.entries(videosObj); // turn the object to array
                // iterate through the videos array and make a song object out of each vid
                for (let i = 0; i < videosObj.length; i++) {
                    const video = await videosObj[i].fetch();

                    const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                    const songInfo = await ytdl.getInfo(url);
                    const time = songInfo.length_seconds;
                    const minutes = Math.floor(time / 60);
                    const seconds = time - minutes * 60;
                    function str_pad_left(string, pad, length) {
                        return (new Array(length + 1).join(pad) + string).slice(-length);
                    }

                    var finalTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
                    const song = {
                        title: songInfo.title,
                        url: songInfo.video_url,
                        length: finalTime,
                    };
                    if (!serverQueue) {
                        const queueContruct = {
                            textChannel: message.channel,
                            voiceChannel: voiceChannel,
                            connection: null,
                            songs: [],
                            volume: 5,
                            playing: true,
                        };
                        // Setting the queue using our contract
                        queue.set(message.guild.id, queueContruct);
                        // Pushing the song to our songs array
                        queueContruct.songs.push(song);

                        try {
                            // Here we try to join the voicechat and save our connection into our object.
                            var connection = await voiceChannel.join();
                            queueContruct.connection = connection;
                            // Calling the play function to start a song
                        } catch (err) {
                            // Printing the error message if the bot fails to join the voicechat
                            console.log(err);
                            queue.delete(message.guild.id);
                            return message.channel.send(err);
                        }
                    } else {
                        serverQueue.songs.push(song);
                    }
                }
                play(message.guild, queueContruct.songs[0]);
                return message.channel.send(`${playlist.title} has been added to the queue!`);
            } catch (err) {
                console.error(err);
                return message.say('Playlist is either private or it does not exist');
            }
        }
        const songInfo = await getURL();
        function getLength(time) {
            const minutes = Math.floor(time / 60);
            const seconds = time - minutes * 60;
            function str_pad_left(string, pad, length) {
                return (new Array(length + 1).join(pad) + string).slice(-length);
            }
            return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
        }
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
            length: getLength(songInfo.length_seconds),
        };
        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };
            // Setting the queue using our contract
            queue.set(message.guild.id, queueContruct);
            // Pushing the song to our songs array
            queueContruct.songs.push(song);

            try {
                // Here we try to join the voicechat and save our connection into our object.
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                // Calling the play function to start a song
                play(message.guild, queueContruct.songs[0]);
            } catch (err) {
                // Printing the error message if the bot fails to join the voicechat
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        } else {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }

        function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }

            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on("finish", () => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            dispatcher.setBitrate(64);
            serverQueue.textChannel.send(`Now playing: **${song.title}**`);
        }
    },
};