var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'slots',
	description: 'Play slots. Default bet is 100.',
	guildOnly: true,
	cooldown: 3,
	usage: ['[bet]'],
	aliases: ['spin'],
	execute(message, args) {
		MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
			if (err) throw err;
			let bet = 100;
			let winnings = 0;
			let leftMiddleRow, midMiddleRow, rightMiddleRow, slots, authorText;
			dbInstance = db.db(currentdb);
			const user = await dbInstance.collection("users").findOne({ id: message.author.id });
			if (user == null) {
				message.reply(`you do not have an account. Do \`!daily\` to make one.`)
				db.close();
			} else {
				if (args.length) {
					if (isNaN(args[0])) {
						message.reply("please make a valid bet.")
						return;
					} else {
						bet = parseInt(args[0].replace(",", "."));
					}
				} else if (user.defaultBet) {
					bet = parseInt(user.defaultBet.toString().replace(",", "."));
				}
				//Actual game
				if (user.balance >= bet && bet > 0) {
					const icons = ["<:yoshiEyes:638396688217800723>","<:Delta:626618870865723412>","<:toonlink_thumbsup:636274276885987359>","<:thinkio:636273251689168896>","<:rileyHead:654001693603921961>","<:mario_peace:636273149960388630>","<:bluetoadohyeah:636273099603443725>","<:pikaWow:638396688226320415>"];
					function randomSlots() {
						return `${icons[Math.floor(Math.random() * icons.length)]}`
					}
					authorText = `${(user.balance - bet).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
					function genSlots() {
						let topRow = `${randomSlots()} ${randomSlots()} ${randomSlots()}`
						leftMiddleRow = `${randomSlots()}`;
						midMiddleRow = `${randomSlots()}`;
						rightMiddleRow = `${randomSlots()}`;
						let middleRow = `${leftMiddleRow} ${midMiddleRow} ${rightMiddleRow}`
						let bottomRow = `${randomSlots()} ${randomSlots()} ${randomSlots()}`
						slots = `${topRow}\n${middleRow}\n${bottomRow}`

					}
					let timer = 1000;
					function pointlessSlots(msg) {
						setTimeout(function () {
							genSlots();

							slotMachine = new Discord.MessageEmbed()
								.setTitle("🎰 Slots 🎰")
								.addField("Current balance", authorText)
								.setDescription(slots)
								.setFooter(`Bet: ${bet} ${message.author.tag}`)
							msg.edit(slotMachine);
						}, timer);
						timer += 1000;
					}
					genSlots();
					let slotMachine = new Discord.MessageEmbed()
						.setTitle("🎰 Slots 🎰")
						.addField("Current balance", authorText)
						.setDescription(slots)
						.setFooter(`Bet: ${bet} ${message.author.tag}`)
					message.channel.send(slotMachine)
						.then(msg => {
							pointlessSlots(msg);
							setTimeout(function () {
								genSlots();

								if (leftMiddleRow === midMiddleRow && rightMiddleRow === leftMiddleRow) {
									winnings = bet * 5;
								} else if (leftMiddleRow === midMiddleRow || leftMiddleRow === rightMiddleRow || rightMiddleRow === midMiddleRow) {
									winnings = bet * 2;
								}
								let color = "#ff0000"
								let title = "Lose";
								if (winnings > 0) {
									authorText = `${(user.balance - bet + winnings).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} +${winnings}`;
									color = "#00ff00"
									title = "WIN!";
								}
								slotMachine = new Discord.MessageEmbed()
									.setTitle(title)
									.setColor(color)
									.addField("Current balance", authorText)
									.setDescription(slots)
									.setFooter(`Bet: ${bet} ${message.author.tag}`)
								msg.edit(slotMachine);
								dbInstance = db.db(currentdb);
								const newBalance = user.balance - bet + winnings;
								const newTotal = user.totalCredits + winnings;
								let totalPlays = 0;
								let lastWin = user.lastWin;
								if (winnings > 0) {
									lastWin = winnings
								}
								if (user.slotsPlays!=undefined) {
									totalPlays = user.slotsPlays + 1;
								}
								const myobj = { id: message.author.id };
								const newvalues = { $set: { balance: newBalance, lastWin: lastWin, totalCredits: newTotal, slotsPlays: totalPlays } };
								dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
									if (err) throw err;
								});

							}, timer);
						})
				} else {
					message.reply("sorry, you do not have enough credits to make that bet.")
				}
			}

		});
	},
};