import dotenv from "dotenv";
import { EmbedBuilder } from 'discord.js';

dotenv.config();

export async function logging(client, title, description) {
    const logEmbed = new EmbedBuilder()
        .setColor('#0468BF');
        // .setTimestamp()
    if (title) { logEmbed.setTitle(title) }
    if (description) { logEmbed.setDescription(description) }

    await client.channels.cache.get(process.env.LOGGING_CH).send({ embeds: [logEmbed] });
}
