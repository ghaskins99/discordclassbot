const Discord = require(`discord.js`);
const { token } = require(`./botconfig.json`);

module.exports = class ClassBot {
	#client = new Discord.Client();

	async initBot() {
		this.#client.once(`ready`, () => {
			console.log(`Ready!`);
		});
	
		await this.#client.login(token);
	}

	async sendSuccessMessage(last, current, courseName)
	{
		const channel = await this.#client.channels.fetch(`733183840813842473`);
		const message = `Class ${courseName} was \`${last ? last : `N/A`}\`, now is \`${current}\``;
		console.log(message);
		await channel.send(`Sending literally any message`);
		await channel.send(`<@${channel.guild.ownerID}> Class \`${courseName}\` was \`${last ? last : `N/A`}\`, now is \`${current}\``);
	}

}