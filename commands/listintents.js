const { projectId } = require('../config.json');
const Discord = require('discord.js');
const dialogflow = require('@google-cloud/dialogflow');
module.exports = {
    name: 'listintents',
    description: 'List intents for DeltaBot AI. (Helper only)',
    needshelper: true,
    category: "mod",
    async execute(message, args) {
        const intentsClient = new dialogflow.IntentsClient({ keyFilename: './Documents/mykey.json' });
        const agentPath = await intentsClient.agentPath(projectId)

        const intentList = await intentsClient.listIntents({ parent: agentPath, intentView: "INTENT_VIEW_FULL" });
        let data = '';
        let listCount = 0;
        intentList[0].forEach(element => {
            data += `${element.displayName} (${element.trainingPhrases.length})`;
            listCount++;
            if (listCount != intentList[0].length) {
                data += ", "
            }
        });
        const embed = new Discord.MessageEmbed()
            .setDescription(data)
            .setTimestamp()
        message.channel.send(embed)

    }
}