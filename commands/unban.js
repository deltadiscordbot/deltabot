module.exports = {
    name: 'unban',
    description: 'Unbans a user. (Mod only)',
    guildOnly: true,
    usage: '[user]',
    args: true,
    needsmod: true,
    execute(message, args) {
        // Ignore messages that aren't from a guild
  if (!message.guild) return;
    // Assuming we mention someone in the message, this will return the user
    // Read more about mentions over at https://discord.js.org/#/docs/main/stable/class/MessageMentions
      var user = args[0];
    // If we have a user mentioned
    if (user) {
        /**
         * Unban the member
         */
        args.shift();
        message.guild.members.unban(user, args.join(" ") + " Unbanned by: " + message.author.tag).then(() => {
          // We let the message author know we were able to kick the person
          message.reply(`Successfully unbanned ${user}`);
        }).catch(err => {
          // An error happened
          // This is generally due to the bot not being able to kick the member,
          // either due to missing permissions or role hierarchy
          message.reply('I was unable to unban the member');
          // Log the error
          console.error(err);
        });
    } else {
      message.reply('You didn\'t mention the user to unban!');
    }
  
},
}