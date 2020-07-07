const Discord = require('discord.js');
const { projectId } = require('../config.json');
const dialogflow = require('@google-cloud/dialogflow');
module.exports = {
    name: 'test',
    description: 'Used for internal testing. (Owner only)',
    needsowner: true,
    cooldown: 1,
    category: "owner",

    async execute(message, args) {
        displayName = args.shift()
        newTrainingPhrases = args.join(" ").split("^")
        messageTexts = [displayName];
        // Instantiates the Intent Client

        const intentsClient = new dialogflow.IntentsClient({ keyFilename: './Documents/mykey.json' });
        const agentPath = await intentsClient.agentPath(projectId)

        const intentList = await intentsClient.listIntents({ parent: agentPath, intentView: "INTENT_VIEW_FULL" });
        let existingIntent;
        intentList[0].forEach(element => {
            if (element.displayName == displayName) {
                existingIntent = element;
                return;
            }
        });
        const intent = existingIntent; //intent that needs to be updated
        const trainingPhrases = [];
        console.log(existingIntent)
        let previousTrainingPhrases =
            existingIntent.trainingPhrases.length > 0
                ? existingIntent.trainingPhrases
                : [];

        previousTrainingPhrases.forEach(textdata => {
            newTrainingPhrases.push(textdata.parts[0].text);
        });

        newTrainingPhrases.forEach(phrase => {
            const part = {
                text: phrase
            };

            // Here we create a new training phrase for each provided part.
            const trainingPhrase = {
                type: "EXAMPLE",
                parts: [part]
            };
            trainingPhrases.push(trainingPhrase);
        });
        intent.trainingPhrases = trainingPhrases;
        const updateIntentRequest = {
            intent,
        };

        // Send the request for update the intent.
        const result = await intentsClient.updateIntent(updateIntentRequest);
        message.reply(`intent ${displayName} was updated.`).then(async msg => {
            const agent = new dialogflow.AgentsClient({ keyFilename: './Documents/mykey.json' })
            const result = await agent.trainAgent({ parent: `projects/${projectId}` });
            if (result[1].done) {
                msg.edit(`${message.author}, intent ${displayName} was updated and trained. \`${msg.createdTimestamp - message.createdTimestamp}ms\``)
            }
        })
    }
}