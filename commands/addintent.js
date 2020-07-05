const { projectId } = require('../config.json');
const dialogflow = require('@google-cloud/dialogflow');
module.exports = {
    name: 'addintent',
    description: 'Adds intent for DeltaBot AI. (Helper only)',
    needshelper: true,
    category: "mod",
    async execute(message, args) {
        displayName = args.shift()
        trainingPhrasesParts = args.join(" ").split("^")
        messageTexts = [displayName];

        // Instantiates the Intent Client
        const intentsClient = new dialogflow.IntentsClient();

        // Construct request

        // The path to identify the agent that owns the created intent.
        const agentPath = intentsClient.agentPath(projectId);

        const trainingPhrases = [];

        trainingPhrasesParts.forEach(trainingPhrasesPart => {
            const part = {
                text: trainingPhrasesPart,
            };

            // Here we create a new training phrase for each provided part.
            const trainingPhrase = {
                type: 'EXAMPLE',
                parts: [part],
            };

            trainingPhrases.push(trainingPhrase);
        });

        const messageText = {
            text: messageTexts,
        };

        const messageReply = {
            text: messageText,
        };

        const intent = {
            displayName: displayName,
            trainingPhrases: trainingPhrases,
            messages: [messageReply],
        };

        const createIntentRequest = {
            parent: agentPath,
            intent: intent,
        };

        // Create the intent
        try {
            const [response] = await intentsClient.createIntent(createIntentRequest);
            message.reply(`intent ${displayName} was created.`).then(async msg => {
                const agent = new dialogflow.AgentsClient({ keyFilename: './Documents/mykey.json' })
                const result = await agent.trainAgent({ parent: `projects/${projectId}` });
                msg.edit(`${message.author}, intent ${displayName} was created and trained ${trainingPhrasesParts.length} phrases. \`${msg.createdTimestamp - message.createdTimestamp}ms\``)
            })
            console.log(`Intent ${response.name} created`);
        } catch (error) {
            message.reply(`intent ${displayName} already exists.`);
        }
    },
};