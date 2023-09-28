import fetch from 'node-fetch';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { get_emoji } from '../utils/level.js';

export const data = new SlashCommandBuilder()
	.setName('유저-검색')
	.setDescription('유저를 검색한 결과를 찾아요')
    .addStringOption(option => option
		.setName('유저명')
		.setDescription('유저의 이름을 입력해주세요')
		.setMaxLength(20) // todo: find nickname min&max length
		.setRequired(true)
	);

export async function execute(interaction) {
	await interaction.deferReply();

	const url = 'https://solved.ac/api/v3/search/user?query='+encodeURI(interaction.options.get('유저명')['value']);
	const response = await fetch(url);
	const data = await response.json();

	if (data['count'] == 0) {
		const searchEmbed = new EmbedBuilder()
		.setDescription(`:face_with_diagonal_mouth: **유저 '${interaction.options.get('유저명')['value']}'에 대한 검색 결과가 없어요**`)
		.setColor('#0468BF');
		await interaction.editReply({ embeds: [searchEmbed] });
	} else {
		const searchEmbed = new EmbedBuilder()
			.setTitle(`📌 유저 '${interaction.options.get('유저명')['value']}'을(를) 검색한 결과입니다`)
			.setColor('#0468BF');

		// Repeat up to 6 times
		let description = '';
		let count = data['count'] <= 6 ? data['count'] : 6;
		for (let i=0; i<count; i++) {
			let item = data['items'][i];
			description += `- **[${get_emoji(item['tier'])} ${item['handle']}](https://solved.ac/profile/${item['handle']})**\n`
		}
		searchEmbed.setDescription(description);

		// Make components
		const viewAllBtn = new ButtonBuilder()
			.setLabel(`전체 보기 (${data['count']}개)`)
			.setURL(url)
			.setStyle(ButtonStyle.Link);
		const row = new ActionRowBuilder().addComponents(viewAllBtn);

		await interaction.editReply({ embeds: [searchEmbed], components: [row] });
	}
}
