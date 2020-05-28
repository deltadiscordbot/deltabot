var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'slots',
	description: 'Play slots. Default bet is 100.',
	guildOnly: true,
	cooldown: 5,
	usage: ['[bet]'],
	aliases: ['spin'],
	execute(message, args) {
	MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function(err, db) {
		if (err) throw err;
		let bet = 100;
		let winnings = 0;
		let leftMiddleRow,midMiddleRow,rightMiddleRow,slots,authorText;
		if(args.length){
			if(isNaN(args[0])){
				message.reply("please make a valid bet.")
				return;
			} else {
			bet = parseInt(args[0])
			}
		}
		dbInstance = db.db(currentdb);
		const user = await dbInstance.collection("users").findOne({id: message.author.id});
		if (user==null){
			message.reply(`you do not have an account. Do \`!daily\` to make one.`)
			db.close();
		}	else{
			//Actual game
			if(user.balance >= bet && bet > 0){
				const icons = ["🍊","🍌","🍉","🍇","🍓","🍒","🍑","🍍"];
				function randomSlots(){
					return `${icons[Math.floor(Math.random() * icons.length)]}`
				}
				authorText = `${user.balance - bet}`;
				function genSlots(){
					let topRow = `${randomSlots()} ${randomSlots()} ${randomSlots()}`
					leftMiddleRow = `${randomSlots()}`;
					midMiddleRow = `${randomSlots()}`;
					rightMiddleRow = `${randomSlots()}`;
					let middleRow = `${leftMiddleRow} ${midMiddleRow} ${rightMiddleRow}`
					let bottomRow = `${randomSlots()} ${randomSlots()} ${randomSlots()}`
					slots = `${topRow}\n${middleRow}\n${bottomRow}`
					
				}
				let timer = 1000;
				function pointlessSlots(msg){
					setTimeout(function(){
						genSlots();

					slotMachine = new Discord.MessageEmbed()
					.setTitle("🎰 Slots 🎰")
					.addField("Current balance",authorText)
					.setDescription(slots)
					.setFooter(message.author.tag)
					   msg.edit(slotMachine);
					}, timer);
					timer += 1000;
				}
				genSlots();
				let slotMachine = new Discord.MessageEmbed()
					.setTitle("🎰 Slots 🎰")
					.addField("Current balance",authorText)
					.setDescription(slots)
					.setFooter(message.author.tag)
				message.channel.send(slotMachine)
				.then(msg => {
					pointlessSlots(msg);
					pointlessSlots(msg);
					pointlessSlots(msg);
					setTimeout(function(){
						genSlots();

						if (leftMiddleRow === midMiddleRow && rightMiddleRow === leftMiddleRow){
							winnings = bet * 5;
						}else if(leftMiddleRow === midMiddleRow || leftMiddleRow === rightMiddleRow || rightMiddleRow === midMiddleRow){
							winnings = bet * 2;
						}
						let color = "#ff0000"
						let title = "Lose";
						if(winnings > 0){
						authorText = `${user.balance - bet + winnings} +${winnings}`;
						color = "#00ff00"
						title = "WIN!";
						} 
					slotMachine = new Discord.MessageEmbed()
					.setTitle(title)
					.setColor(color)
					.addField("Current balance",authorText)
					.setDescription(slots)
					.setFooter(message.author.tag)
						msg.edit(slotMachine);
						dbInstance = db.db(currentdb);
						const newTotal = user.balance - bet + winnings;
	  
					  const myobj = { id: message.author.id, balance: user.balance , dailytime: user.dailytime};
					  const newvalues = { $set: {id: message.author.id, balance: newTotal, lastWin: winnings} };
					  dbInstance.collection("users").updateOne(myobj,newvalues, function(err, res) {
					  if (err) throw err;
					  });
   
					 }, timer); 
				  })
			} else{
				message.reply("sorry, you do not have enough credits to make that bet.")
			}
			}
		
	});
	},
};