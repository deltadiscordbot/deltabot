module.exports = {
    name: 'ban',
    description: 'Bans a user. (Mod only)',
    guildOnly: true,
    usage: '[user]',
    args: true,
    needsmod: true,
    execute(message, args) {
        // Ignore messages that aren't from a guild
  if (!message.guild) return;
  
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
    var user = message.mentions.users.first();
    
    // If we have a user mentioned
    if (user) {
      // Now we get the member from the user
      const member = message.guild.member(user);
      // If the member is in the guild
      if (member) {
        /**
         * Kick the member
         * Make sure you run this on a member, not a user!
         * There are big differences between a user and a member
         */
        args.shift();
        member.ban(args.join(" ") + " Banned by: " + message.author.username + "#" + message.author.discriminator).then(() => {
          // We let the message author know we were able to kick the person
          message.reply(`Successfully banned ${user.tag}`);
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to kick the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to ban the member');
          // Log the error
          console.error(err);
        });
      } else {
        // The mentioned user isn't in this guild
        message.reply('That user isn\'t in this guild! You can ban by ID with \`!ban [userID]\`');
      }
    // Otherwise, if no user was mentioned
    } else if (args.length) {
      user = args[0];
      args.shift();
      message.guild.ban(user,args.join(" ") + " Banned by: " + message.author.tag).then(() => {
        // We let the message author know we were able to kick the person
        message.reply(`Successfully banned ${user}`);
      }).catch(err => {
        // An error happened
        // This is generally due to the bot not being able to kick the member,
        // either due to missing permissions or role hierarchy
        message.reply('I was unable to ban the user');
        // Log the error
        console.error(err);
      });
    } else {
      message.reply('You didn\'t mention the user to ban!');
    }
  
},
}