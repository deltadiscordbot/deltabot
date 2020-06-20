module.exports = {
	name: 'reload',
	description: 'Reloads a command. (Owner only)',
	needsowner: true,
	category: "owner",
	execute(message, args) {
		if (!args.length) {
			let currentCommand = '';
			message.client.commands.forEach(async element => {
				currentCommand = await message.client.commands.get(element.name)
				delete require.cache[require.resolve(`./${currentCommand.name}.js`)];
				try {
					const newCommand = require(`./${currentCommand.name}.js`);
					message.client.commands.set(newCommand.name, newCommand);
				} catch (error) {
					console.log(error);
					message.channel.send(`There was an error while reloading a commands:\n\`${error.message}\``);
				}
			});
			message.channel.send(`${message.client.commands.size} commands were reloaded!`);
			console.log(`${message.client.commands.size} commands were reloaded!`);

		} else {
			const commandName = args[0].toLowerCase();
			const command = message.client.commands.get(commandName)
				|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) {
				return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
			}

			delete require.cache[require.resolve(`./${command.name}.js`)];

			try {
				const newCommand = require(`./${command.name}.js`);
				message.client.commands.set(newCommand.name, newCommand);
				message.channel.send(`Command \`${command.name}\` was reloaded!`);
				console.log(`Command \`${command.name}\` was reloaded!`);
			} catch (error) {
				console.log(error);
				message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
			}
		}
	},
};