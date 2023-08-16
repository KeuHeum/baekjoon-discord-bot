import dotenv from "dotenv";
import { REST, Routes } from 'discord.js';

dotenv.config();

export function deploySlashCommands (client, commands) {
	const rest = new REST().setToken(process.env.TOKEN);
	
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
	
			const data = await rest.put(
				Routes.applicationCommands(process.env.APPLICATION_ID),
				{ body: commands }
			);

			client.data = data;
	
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}
