import commands from "./util/commands.js";
import { REST, Routes } from "discord.js";
import { readConfig } from "./util/general.js";

(async () => {
	const { token, clientId } = await readConfig();
	const rest = new REST({ version: `10` }).setToken(token);

	try {
		console.log(`Started refreshing application (/) commands.`);

		await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});

		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
