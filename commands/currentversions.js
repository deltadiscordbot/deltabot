const Discord = require('discord.js');
module.exports = {
  name: 'currentversions',
  description: 'Gets current versions of Riley\'s apps.',
  cooldown: 1,
  aliases: ['cv'],

  needsguild: true,
  async execute(message, args) {
    const dataItems = await message.client.dbInstance.collection('data').findOne({});
    appsList = dataItems.apps;
    //appsList 0-altstore, 1-delta, 2-beta altstore, 3-beta delta, 4-alpha altstore, 5-alpha delta, 6-beta clip, 7-clip
    const altstoreVersion = appsList[0];
    const deltaVersion = appsList[1];
    const altstoreBetaVersion = appsList[2];
    const deltaBetaVersion = appsList[3];
    const altstoreAlphaVersion = appsList[4];
    const deltaAlphaVersion = appsList[5];
    const clipBetaVersion = appsList[6];
    clipVersion = appsList[7];
    const embed = new Discord.MessageEmbed()
      .setTitle("Current versions")
      .addField("AltStore", altstoreVersion, true)
      .addField("AltStore Beta", altstoreBetaVersion, true)
      .addField("AltStore Alpha", altstoreAlphaVersion, true)
      .addField("Delta", deltaVersion, true)
      .addField("Delta Beta", deltaBetaVersion, true)
      .addField("Delta Alpha", deltaAlphaVersion, true)
      .addField("Clip", clipVersion, true)
      .addField("Clip Beta", clipBetaVersion, true)
      .setTimestamp()
      .setFooter(`Requested by: ${message.author.tag}`)
    message.channel.send(embed);
  },
};