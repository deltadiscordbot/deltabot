var MongoClient = require('mongodb').MongoClient;
const { mongodbase, currentdb } = require('../config.json');
const Discord = require('discord.js');
module.exports = {
	name: 'connect4',
	description: 'Play connect 4 with someone else. Must have another player. Default bet is 100.',
	guildOnly: true,
	cooldown: 3,
	usage: ['(opponent) [bet]'],
	aliases: ['con4', 'con'],
	execute(message, args) {
		MongoClient.connect(mongodbase, { useUnifiedTopology: true }, async function (err, db) {
			if (err) throw err;
			let bet = 100;
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
					const redPiece = "🔴";
					const bluePiece = "🔵";
					const whitePiece = "⚪";
					const numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];
					const playSpots = [1, 2, 3, 4, 5, 6, 7];
					let gameBoard = [[], [], [], [], [], [], []];
					const boardHeight = 7;
					const boardWidth = 7;
					let board = "";
					async function buildBoard() {
						board = "";
						for (let height = 0; height < boardHeight; height++) {
							for (let width = 0; width < boardWidth; width++) {
								if (height == 0) {
									gameBoard[width][height] = numbers[width];
								}
								if (typeof gameBoard[width][height] === "undefined") {
									board += whitePiece;
								} else {
									if (gameBoard[width][height] == "redPiece") {
										board += redPiece;
									} else if (gameBoard[width][height] == "bluePiece") {
										board += bluePiece;
									} else {
										board += numbers[width];

									}
								}
							}
							board += "\n";
						}
					}
					let timeout = 30;
					let turnCount = 0;
					let moveTimeout = 30;
					let gameStarted = false;
					let whosTurn = message.author;
					const player1 = message.author;
					let player2, user2, gameMessage, winner = "";
					function startGame(u, user, msg, timer) {
						user2 = user;
						gameMessage = msg;
						player2 = u;
						clearInterval(timer);
						gameStarted = true;
						msg.reactions.removeAll();
						buildBoard();
						let connect4Embed = new Discord.MessageEmbed()
							.setTitle(`Connect 4 | ${whosTurn.username}'s turn | ${moveTimeout} secs`)
							.setDescription(board)
							.addField("How to play", "Reply with a number to place your piece.")
							.setFooter(`Pot: ${bet * 2} | ${redPiece}${message.author.tag} vs ${bluePiece}${player2.tag}`)
						msg.edit(connect4Embed)
						getMove();
					}
					function getMove() {
						const msgCollector = message.channel.createMessageCollector(m => (playSpots.includes(parseInt(m.content)) && m.author.id == whosTurn.id), { time: 30000 });
						let moveTimer = setInterval(() => {
							moveTimeout -= 5;
							let connect4Embed = new Discord.MessageEmbed()
								.setTitle(`Connect 4 | ${whosTurn.username}'s turn | ${moveTimeout} secs`)
								.setDescription(board)
								.addField("How to play", "Reply with a number to place your piece.")
								.setFooter(`Pot: ${bet * 2} | ${redPiece}${message.author.tag} vs ${bluePiece}${player2.tag}`)
							gameMessage.edit(connect4Embed)
						}, 5000)
						msgCollector.on("collect", m => {
							clearInterval(moveTimer);
							m.delete();
							turnCount++;
							makeMove(parseInt((m.content) - 1), msgCollector);
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
						for (let height = boardHeight - 1; height > 0; height--) {
							if (typeof gameBoard[move][height] === "undefined") {
								if (whosTurn.id == player1.id) {
									msgCollector.stop();
									gameBoard[move][height] = "redPiece";
									whosTurn = player2;
									playingGame();
									break;
								} else if (whosTurn.id == player2.id) {
									msgCollector.stop();
									gameBoard[move][height] = "bluePiece";
									whosTurn = player1;
									playingGame();
									break;
								}
							}

						}
					}
					function horCheck(width, height) {
						if (gameBoard[width][height] == gameBoard[width + 1][height] && gameBoard[width + 2][height] == gameBoard[width + 1][height] && gameBoard[width + 3][height] == gameBoard[width + 1][height]) {
							if (gameBoard[width][height] == "redPiece") {
								winner = player1;
							} else if (gameBoard[width][height] == "bluePiece") {
								winner = player2;
							}
						}
					}
					function vertCheck(width, height) {
						if (gameBoard[width][height] == gameBoard[width][height + 1] && gameBoard[width][height + 2] == gameBoard[width][height + 1] && gameBoard[width][height + 3] == gameBoard[width][height + 1]) {
							if (gameBoard[width][height] == "redPiece") {
								winner = player1;
							} else if (gameBoard[width][height] == "bluePiece") {
								winner = player2;
							}
						}
					}
					function diagRightCheck(width, height) {
						if (gameBoard[width][height] == gameBoard[width + 1][height - 1] && gameBoard[width + 2][height - 2] == gameBoard[width + 1][height - 1] && gameBoard[width + 3][height - 3] == gameBoard[width + 1][height - 1]) {
							if (gameBoard[width][height] == "redPiece") {
								winner = player1;
							} else if (gameBoard[width][height] == "bluePiece") {
								winner = player2;
							}
						}
					}
					function diagLeftCheck(width, height) {
						if (gameBoard[width][height] == gameBoard[width - 1][height - 1] && gameBoard[width - 2][height - 2] == gameBoard[width - 1][height - 1] && gameBoard[width - 3][height - 3] == gameBoard[width - 1][height - 1]) {
							if (gameBoard[width][height] == "redPiece") {
								winner = player1;
							} else if (gameBoard[width][height] == "bluePiece") {
								winner = player2;
							}
						}
					}

					function winCheck() {
						//horizontal check
						for (let height = boardHeight - 1; height > 0; height--) {
							horCheck(0, height);
							horCheck(1, height);
							horCheck(2, height);
							horCheck(3, height);
						}
						//ver check
						for (let width = 0; width < boardWidth; width++) {
							vertCheck(width, 1);
							vertCheck(width, 2);
							vertCheck(width, 3);
						}
						//diag up to the right
						for (let width = 0; width < boardWidth - 3; width++) {
							diagRightCheck(width, 4);
							diagRightCheck(width, 5);
							diagRightCheck(width, 6);
						}
						//diag up to the left
						for (let width = boardWidth - 1; width > 2; width--) {
							diagLeftCheck(width, 4);
							diagLeftCheck(width, 5);
							diagLeftCheck(width, 6);
						}


					}

					function playingGame() {
						buildBoard();
						winCheck();
						if (winner == "") {
							if (turnCount > 41) {
								let connect4Embed = new Discord.MessageEmbed()
									.setTitle(`Connect 4 | Tie!`)
									.setDescription(board)
									.setFooter(`Pot: ${bet * 2} | ${redPiece}${message.author.tag} vs ${bluePiece}${player2.tag}`)
								gameMessage.edit(connect4Embed)

							} else {
								moveTimeout = 30;
								let connect4Embed = new Discord.MessageEmbed()
									.setTitle(`Connect 4 | ${whosTurn.username}'s turn | ${moveTimeout} secs`)
									.setDescription(board)
									.addField("How to play", "Reply with a number to place your piece.")
									.setFooter(`Pot: ${bet * 2} | ${redPiece}${message.author.tag} vs ${bluePiece}${player2.tag}`)
								gameMessage.edit(connect4Embed)
								getMove();
							}
						} else {
							win();
						}
					}
					function win() {
						let color;
						let newBalancep1, newBalancep2, newTotal, newTotal2, lastWin, lastWin2;
						let conWins = 0, conWins2 = 0;
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
							if (user.con4Wins != undefined) {
								conWins = user.con4Wins + 1;
							} else {
								conWins = 1;
							}
							if (user2.con4Wins != undefined) {
								conWins2 = user2.con4Wins;
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
							if (user.con4Wins != undefined) {
								conWins = user.con4Wins;
							}
							if (user2.con4Wins != undefined) {
								conWins2 = user2.con4Wins + 1;
							} else {
								conWins2 = 1;
							}
						}
						let connect4Embed = new Discord.MessageEmbed()
							.setTitle(`Connect 4 | ${winner.username} won!`)
							.setColor(color)
							.setDescription(board)
							.setFooter(`Pot: ${bet * 2} | ${redPiece}${message.author.tag} vs ${bluePiece}${player2.tag}`)
						gameMessage.edit(connect4Embed)
						//database logic
						dbInstance = db.db(currentdb);
						let totalPlays = 0;
						let totalPlays2 = 0;
						if (user.con4Plays != undefined) {
							totalPlays = user.con4Plays + 1;
						}
						if (user2.con4Plays != undefined) {
							totalPlays2 = user2.con4Plays + 1;
						}
						const myobj = { id: message.author.id };
						const newvalues = { $set: { balance: newBalancep1, lastWin: lastWin, totalCredits: newTotal, con4Plays: totalPlays, con4Wins: conWins } };
						dbInstance.collection("users").updateOne(myobj, newvalues, function (err, res) {
							if (err) throw err;
						});
						const myobj2 = { id: player2.id };
						const newvalues2 = { $set: { balance: newBalancep2, lastWin: lastWin2, totalCredits: newTotal2, con4Plays: totalPlays2, con4Wins: conWins2 } };
						dbInstance.collection("users").updateOne(myobj2, newvalues2, function (err, res) {
							if (err) throw err;
						});

					}
					let connect4Embed = new Discord.MessageEmbed()
						.setTitle("Connect 4")
						.setDescription(`Bet is ${bet}. React to play. Ends in ${timeout} seconds.`)
						.setFooter(`Bet: ${bet} | ${message.author.tag}`)
					message.channel.send(connect4Embed)
						.then(msg => {
							timer = setInterval(() => {
								timeout -= 5;
								let connect4Embed = new Discord.MessageEmbed()
									.setTitle("Connect 4")
									.setDescription(`Bet is ${bet}. React to play. Expires in ${timeout} seconds.`)
									.setFooter(`Bet: ${bet} | ${message.author.tag}`)
								msg.edit(connect4Embed)
							}, 5000);
							setTimeout(() => {
								if (!gameStarted) {
									clearInterval(timer);
									let connect4Embed = new Discord.MessageEmbed()
										.setTitle("Connect 4")
										.setDescription(`Game expired.`)
										.setFooter(`Bet: ${bet} | ${message.author.tag}`)
									msg.edit(connect4Embed)
									msg.reactions.removeAll();
								}
							}, timeout * 1000);
							msg.react("✅");
							const playFilter = (reaction, user) => reaction.emoji.name === '✅' && (user.id != (msg.author.id) && (user.id != message.author.id));
							const playReact = msg.createReactionCollector(playFilter, { timer: 30000, idle: 30000, dispose: true });
							playReact.on("collect", (r, u) => {
								dbInstance.collection("users").findOne({ id: u.id })
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
							playReact.on("end", e => {
							})
						})
				} else {
					message.reply("sorry, you do not have enough credits to make that bet.")
				}
			}

		});
	},
};