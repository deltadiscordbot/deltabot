const snoowrap = require('snoowrap');
const { redditAccessToken, redditClientID, redditClientSecret, redditRefreshToken } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
    name: 'reddit',
    description: 'Gets a random post from a subreddit',
    usage: ['[subreddit]'],
    category: "fun",
    args: true,
    guildOnly: true,
    aliases: ['r/'],
    execute(message, args) {
        const r = new snoowrap({
            userAgent: 'deltabot:com.discordbot.deltabot:v1.0.0 (by /u/deltabot)',
            clientId: redditClientID,
            clientSecret: redditClientSecret,
            refreshToken: redditRefreshToken
        });
        r.getSubreddit(args.join(" ")).getRandomSubmission().then(post => {
            if (post.url != undefined && !post.over_18) {
                message.channel.send(post.url)
            } else {
                message.channel.send("No post found.")
            }
        }).catch(err => { if (err) { message.channel.send("Error finding subreddit.") } })
    },
};