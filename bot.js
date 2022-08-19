import interactions from "./util/interactions.js";
import { Client, GatewayIntentBits } from "discord.js";
import { readConfig } from "./util/general.js";

export default class ClassBot {
	#client = new Client({ intents: [GatewayIntentBits.Guilds] });

	async initBot() {
		const { token } = await readConfig();
		this.#client.once(`ready`, () => {
			console.log(`i am ${this.#client.user.tag}`);
		});

		this.#client.on(`interactionCreate`, async interaction => {
			if (!interaction.isChatInputCommand()) return;

			if (!interactions[interaction.commandName]) {
				await interaction.reply(`its missing`);
				return;
			}

			await interactions[interaction.commandName](interaction);
		});

		await this.#client.login(token);
	}

	async sendSuccessMessage(last, current, courseName, channelId, users) {
		if (users === undefined || users === null) {
			// me if not there
			users = [`206476533135704064`];
		}

		const channel = await this.#client.channels.fetch(channelId);

		const userTags = users.map(u => `<@${u}>`).join(` `);

		await channel.send(
			`${userTags} Class \`${courseName}\` was \`${
				last ? last : `N/A`
			}\`, now is \`${current}\``
		);
	}
}
