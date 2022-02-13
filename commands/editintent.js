const { projectId } = require('../config.json');
const dialogflow = require('@google-cloud/dialogflow');
module.exports = {
    name: 'editintent',
    description: 'Editing an intent for DeltaBot AI. (Helper only)',
    needshelper: true,
    category: "mod",
    async execute(message, args) {
        displayName = args.shift()
        newTrainingPhrases = args.join(" ").split("^")
        messageTexts = [displayName];

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
        const intent = existingIntent;
        if (intent != undefined) {
            const trainingPhrases = [];
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
                msg.edit(`${message.author}, intent ${displayName} was updated and trained ${newTrainingPhrases.length} phrases. \`${msg.createdTimestamp - message.createdTimestamp}ms\``)
            })
        } else {
            message.reply("no intent found.")
        }
    }
}