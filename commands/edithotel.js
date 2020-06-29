const Discord = require('discord.js');
module.exports = {
    name: 'edithotel',
    description: 'Use this command to edit your floors!',
    guildOnly: true,
    needsdb: true,
    category: "eco",
    aliases: ['editfloor', 'editfloors'],
    async execute(message, args, dbInstance) {
        //If user didnt specify floor, send usage directions
        if(!args.length){
            const embed = new Discord.MessageEmbed()
                .setTitle("How to edit a floor")
                .setDescription(`!editfloor [FloorNumber]`)
                .addField("Disclaimer", "Floors must contain appropriate information, if you are found to be using inappropriate information you will be banned from the hotel.")
                .setTimestamp()
                .setFooter(`Requested by: ${message.author.tag}`)
            return message.channel.send(embed);
        }
        if(isNaN(args[0])) return message.reply("That is not a valid number!");
        let selectedFloor = parseInt(args[0]);
        const currentFloorData = await dbInstance.collection("hotel").findOne({ floor: selectedFloor });
        if(currentFloorData == null) return message.reply("That floor has not been bought by anyone!");
        //Check if user owns floor
        if(currentFloorData.ownerID !== message.author.id) return message.reply('You do not own this floor!!');
        //Send a message containing all possible edit fields
        let userEditFieldRequest = await message.channel.send(`Please type what you want to edit: \n\`Name\`,\n\`Description,\`\n\`Icon\``)
        //Only look for messages sent by original user
        const filter = m => message.author.id === m.author.id;
        //Now wait 20 seconds for the user to message a field to edit
        let userEditSelection;
        try {
            userEditSelection = await message.channel.awaitMessages(filter, { time:20000, max: 1, errors: ['time'] });
        } catch (error) {
            await userEditFieldRequest.edit("Timer Expired");
            return userEditFieldRequest.delete({timeout: 5000});
        }
        //Delete bot and user message
        userEditFieldRequest.delete();
        userEditSelection.first().delete();
        //Check if the user selected field is valid
        switch (userEditSelection.first().content.toLowerCase()) {
            case "name":
            case "title":
                editInfo(message, selectedFloor, 'Name');
                break;
            case "description":
            case "desc":
                editInfo(message, selectedFloor, 'Description');
                break;
            case "icon":
            case "logo":
                editInfo(message, selectedFloor,'Icon');
                break;
            default:
                return message.channel.send("That is not a valid selection!");
        };
        //This function asks the users for the new floor info, and makes the nessessary changes in the database 
        async function editInfo(message, floorLevel, fieldToEdit) {
            //Ask user for the new floor info
            let userEditRequestMessage = await message.channel.send(`Please enter a new floor ${fieldToEdit}!`);
            //Wait for user response for 20 seconds
            const filter = m => message.author.id === m.author.id;
            let newFloorInfoMessage;
            try {
                newFloorInfoMessage = await message.channel.awaitMessages(filter, { time:20000, max: 1, errors: ['time'] });
            } catch (error) {
                await userEditRequestMessage.edit("Timer Expired");
                return userEditRequestMessage.delete({timeout: 5000});
            }
            newFloorInfoMessage.first().delete();
            userEditRequestMessage.delete();
            newFloorInfoMessage = newFloorInfoMessage.first().content.toString();
            //Perform extra verification if user is editing the Icon url
            if (fieldToEdit == "Icon"){
            const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                
                if(!pattern.test(newFloorInfoMessage)) return message.channel.send("That url is invalid! Try again!")
            }
            //Update the document!!
            const myobj = { floor: floorLevel };
            const newvalues = { $set: { [`floor${fieldToEdit}`]: newFloorInfoMessage } };
            dbInstance.collection("hotel").updateOne(myobj, newvalues, function (err, res) {
                if (err) throw err;
                message.channel.send("Edited the floor!");
            });
        }
    } 
}
