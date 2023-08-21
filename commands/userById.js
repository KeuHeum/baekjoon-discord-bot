import fetch from 'node-fetch';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { get_emoji } from '../utils/level.js';

export const data = new SlashCommandBuilder()
	.setName('유저')
	.setDescription('유저 id를 통해 유저의 정보를 보내줘요')
	.addIntegerOption(option => option
		.setName('id')
		.setDescription('백준 문제의 id를 입력해주세요')
		.setRequired(true)
	);

export async function execute(interaction) {
	await interaction.deferReply();

	const url = 'https://solved.ac/api/v3/user/show?handle='+interaction.options.get('id')['value'];
	const response = await fetch(url);
	const data = await response.json();

	await interaction.editReply({ embeds: [searchEmbed], components: [row] });
}