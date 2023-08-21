import fetch from 'node-fetch';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { get_emoji } from '../utils/level.js';

export const data = new SlashCommandBuilder()
	.setName('유저-검색')
	.setDescription('유저를 검색한 결과를 찾아요')
    .addStringOption(option => option
		.setName('검색어')
		.setDescription('검색하고싶은 검색어를 입력해주세요')
		.setMaxLength(20) // todo: find nickname max length
		.setRequired(true)
	);

export async function execute(interaction) {
	await interaction.deferReply();

	const url = 'https://solved.ac/api/v3/search/user?query='+interaction.options.get('id')['value'];
	const response = await fetch(url);
	const data = await response.json();

	await interaction.editReply({ embeds: [searchEmbed], components: [row] });
}