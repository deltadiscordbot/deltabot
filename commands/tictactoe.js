const Discord = require('discord.js');
module.exports = {
	name: 'tictactoe',
	description: 'Play tic tac toe with someone else. Must have another player. Default bet is 100.',
	guildOnly: true,

	cooldown: 3,
	category: "eco",
	usage: ['(opponent) [bet]'],
	aliases: ['ttt'],
	async execute(message, args) {
		let bet = 100;
		const user = await message.client.dbInstance.collection("users").findOne({ id: message.author.id });
		if (user == null) {
			message.reply(`you do not have an account. Do \`!daily\` to make one.`)
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
				const xPiece = "❌";
				const oPiece = "⭕";
				const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
				let playSpots = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				let gameBoard = numbers;
				let board = "";
				async function buildBoard() {
					board = `${gameBoard[0]}|${gameBoard[1]}|${gameBoard[2]}\n${gameBoard[3]}|${gameBoard[4]}|${gameBoard[5]}\n${gameBoard[6]}|${gameBoard[7]}|${gameBoard[8]}`
				}
				let timeout = 30;
				let turnCount = 0;
				let moveTimeout = 30;
				let gameStarted = false;
				let whosTurn = message.author;
				const player1 = message.author;
				let player2, user2, gameMessage, winner = "";
				let canStop = true;
				function startGame(u, user, msg, timer) {
					clearInterval(timer);
					user2 = user;
					gameMessage = msg;
					player2 = u;
					msg.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
					gameStarted = true;
					buildBoard();
					let tttEmbed = new Discord.MessageEmbed()
						.setTitle(`Tic Tac Toe | ${whosTurn.username}'s turn | ${moveTimeout} secs`)
						.setDescription(board)
						.addField("How to play", "Reply with a number to place your piece.")
						.setFooter(`Pot: ${bet * 2} | ${xPiece}${message.author.tag} vs ${oPiece}${player2.tag}`)
					msg.edit(tttEmbed)
					getMove();
				}
				function getMove() {
					const msgCollector = message.channel.createMessageCollector(m => (playSpots.includes(parseInt(m.content)) && m.author.id == whosTurn.id), { time: 30000 });
					let moveTimer = setInterval(() => {
						moveTimeout -= 5;
						let connect4Embed = new Discord.MessageEmbed()
							.setTitle(`Tic Tac Toe | ${whosTurn.username}'s turn | ${moveTimeout} secs`)
							.setDescription(board)
							.addField("How to play", "Reply with a number to place your piece.")
							.setFooter(`Pot: ${bet * 2} | ${xPiece}${message.author.tag} vs ${oPiece}${player2.tag}`)
						gameMessage.edit(connect4Embed)
					}, 5000)
					msgCollector.on("collect", m => {
						clearInterval(moveTimer);
						m.delete();
						turnCount++;
						makeMove(playSpots.splice(playSpots.indexOf(parseInt(m.content)), 1), msgCollector);
					});
					msgCollector.on("end", (e, r) => {
						if (r == "time") {
							clearInterval(moveTimer);
							if (whosTurn.id == player1.id) {
								winner = player2;
							} else if (whosTurn.id == player2.id) {
								winner = player1;
							}
							win();
						}
					});
				}
				function makeMove(move, msgCollector) {
					msgCollector.stop()
					if (whosTurn == player1) {
						gameBoard[move - 1] = xPiece;
						whosTurn = player2;
						playingGame();
					} else if (whosTurn == player2) {
						gameBoard[move - 1] = oPiece;
						whosTurn = player1;
						playingGame();
					}
				}
				function horCheck(space) {
					if (gameBoard[space] == gameBoard[space + 1] && gameBoard[space + 1] == gameBoard[space + 2]) {
						if (gameBoard[space] == xPiece) {
							winner = player1;
						} else {
							winner = player2;
						}
					}
				}
				function vertCheck(space) {
					if (gameBoard[space] == gameBoard[space + 3] && gameBoard[space + 3] == gameBoard[space + 6]) {
						if (gameBoard[space] == xPiece) {
							winner = player1;
						} else {
							winner = player2;
						}
					}
				}
				function winCheck() {
					//horizontal check
					horCheck(0);
					horCheck(3);
					horCheck(6);
					//vert check
					vertCheck(0);
					vertCheck(1);
					vertCheck(2);
					//diag check
					if (gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8]) {
						if (gameBoard[0] == xPiece) {
							winner = player1;
						} else {
							winner = player2;
						}
					}
					if (gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6]) {
						if (gameBoard[2] == xPiece) {
							winner = player1;
						} else {
							winner = player2;
						}
					}
				}
				function playingGame() {
					if (canStop) {
						gameMessage.reactions.removeAll();
					}
					canStop = false;
					buildBoard();
					winCheck();
					if (winner == "") {
						if (turnCount > 8) {
							let tttEmbed = new Discord.MessageEmbed()
								.setTitle(`Tic Tac Toe | Tie!`)
								.setDescription(board)
								.setFooter(`Pot: ${bet * 2} | ${xPiece}${message.author.tag} vs ${oPiece}${player2.tag}`)
							gameMessage.edit(tttEmbed)

						} else {
							moveTimeout = 30;
							let tttEmbed = new Discord.MessageEmbed()
								.setTitle(`Tic Tac Toe | ${whosTurn.username}'s turn | ${moveTimeout} secs`)
								.setDescription(board)
								.addField("How to play", "Reply with a number to place your piece.")
								.setFooter(`Pot: ${bet * 2} | ${xPiece}${message.author.tag} vs ${oPiece}${player2.tag}`)
							gameMessage.edit(tttEmbed)
							getMove();
						}
					} else {
						win();
					}
				}
				function win() {
					let color;
					let newBalancep1, newBalancep2, newTotal, newTotal2, lastWin, lastWin2;
					let tttWins = 0, tttWins2 = 0;
					if (winner == player1) {
						color = "#FF0000";
						newBalancep1 = user.balance + bet;
						newBalancep2 = user2.balance - bet;
						newTotal = user.totalCredits + bet;
						newTotal2 = user2.totalCredits;
						if (user.lastWin != undefined) {
							lastWin = bet;
						}
						if (user2.lastWin != undefined) {
							lastWin2 = user2.lastWin;
						} else {
							lastWin2 = 0;
						}
						if (user.tttWins != undefined) {
							tttWins = user.tttWins + 1;
						} else {
							tttWins = 1;
						}
						if (user2.tttWins != undefined) {
							tttWins2 = user2.tttWins;
						}
					} else if (winner == player2) {
						color = "#00bfff";
						newBalancep1 = user.balance - bet;
						newBalancep2 = user2.balance + bet;
						newTotal = user.totalCredits;
						newTotal2 = user2.totalCredits + bet;
						if (user2.lastWin != undefined) {
							lastWin2 = bet;
						}
						if (user.lastWin != undefined) {
							lastWin = user.lastWin;
						} else {
							lastWin = 0;
						}
						if (user.tttWins != undefined) {
							tttWins = user.tttWins;
						}
						if (user2.tttWins != undefined) {
							tttWins2 = user2.tttWins + 1;
						} else {
							tttWins2 = 1;
						}
					}
					let tttEmbed = new Discord.MessageEmbed()
						.setTitle(`Tic Tac Toe | ${winner.username} won!`)
						.setColor(color)
						.setDescription(board)
						.setFooter(`Pot: ${bet * 2} | ${xPiece}${message.author.tag} vs ${oPiece}${player2.tag}`)
					gameMessage.edit(tttEmbed)
					//database logic
					let totalPlays = 0;
					let totalPlays2 = 0;
					if (user.tttPlays != undefined) {
						totalPlays = user.tttPlays + 1;
					}
					if (user2.tttPlays != undefined) {
						totalPlays2 = user2.tttPlays + 1;
					}
					const myobj = { id: message.author.id };
					const newvalues = { $set: { balance: newBalancep1, lastWin: lastWin, totalCredits: newTotal, tttPlays: totalPlays, tttWins: tttWins } };
					message.client.dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
						if (err) throw err;
					});
					const myobj2 = { id: player2.id };
					const newvalues2 = { $set: { balance: newBalancep2, lastWin: lastWin2, totalCredits: newTotal2, tttPlays: totalPlays2, tttWins: tttWins2 } };
					message.client.dbInstance.collection("users").updateOne(myobj2, newvalues2, function (err, res) {
						if (err) throw err;
					});
				}
				let tttEmbed = new Discord.MessageEmbed()
					.setTitle("Tic Tac Toe")
					.setDescription(`Bet is ${bet}. React to play. Ends in ${timeout} seconds.`)
					.setFooter(`Bet: ${bet} | ${message.author.tag}`)
				message.channel.send(tttEmbed)
					.then(msg => {
						timer = setInterval(() => {
							timeout -= 5;
							let tttEmbed = new Discord.MessageEmbed()
								.setTitle("Tic Tac Toe")
								.setDescription(`Bet is ${bet}. React to play. Expires in ${timeout} seconds.`)
								.setFooter(`Bet: ${bet} | ${message.author.tag}`)
							msg.edit(tttEmbed)
						}, 5000);
						setTimeout(() => {
							if (!gameStarted) {
								try {
									msg.reactions.cache.get('✅').remove().catch(error => console.error('Failed to remove reactions: ', error));
								} catch (error) {
									console.log(error)
								}
								clearInterval(timer);
								let tttEmbed = new Discord.MessageEmbed()
									.setTitle("Tic Tac Toe")
									.setDescription(`Game expired.`)
									.setFooter(`Bet: ${bet} | ${message.author.tag}`)
								msg.edit(tttEmbed)
								msg.reactions.removeAll();
							}
						}, timeout * 1000);
						msg.react("✅");
						msg.react("❌")
						const playFilter = (reaction, user) => reaction.emoji.name === '✅' && (user.id != (msg.author.id) && (user.id != message.author.id));
						const playReact = msg.createReactionCollector(playFilter, { timer: 30000, idle: 30000, dispose: true });
						const stopFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id == message.author.id;
						const stopReact = msg.createReactionCollector(stopFilter, { timer: 30000, idle: 30000, dispose: true });
						playReact.on("collect", (r, u) => {
							message.client.dbInstance.collection("users").findOne({ id: u.id })
								.then(player2 => {
									if (player2 == null) {
										message.channel.send(`${u}, you do not have an account. Do \`!daily\` to make one.`)
											.then(msg2 => {
												setTimeout(() => {
													msg2.delete();
												}, 5000)
											})
									} else if (player2.balance >= bet) {
										startGame(u, player2, msg, timer);
									} else {
										message.channel.send(`${u}, you do not have enough credits to play.`)
											.then(msg2 => {
												setTimeout(() => {
													msg2.delete();
												}, 5000)
											})
									}
								})
						})
						stopReact.on("collect", r => {
							clearInterval(timer);
							let tttEmbed = new Discord.MessageEmbed()
								.setTitle("Tic Tac Toe")
								.setDescription(`Game cancelled.`)
								.setFooter(`Bet: ${bet} | ${message.author.tag}`)
							msg.edit(tttEmbed)
							msg.reactions.removeAll();
							stopReact.stop();
							playReact.stop();
						})
					})
			} else {
				message.reply("sorry, you do not have enough credits to make that bet.")
			}
		}
	},
};