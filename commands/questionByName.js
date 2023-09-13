import fetch from 'node-fetch';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { get_emoji } from '../utils/level.js';

export const data = new SlashCommandBuilder()
	.setName('문제-검색')
	.setDescription('문제를 검색한 결과를 찾아요')
	.addStringOption(option => option
		.setName('검색어')
		.setDescription('검색하고싶은 검색어를 입력해주세요')
		.setMaxLength(10)
		.setRequired(true)
	);

export async function execute(interaction) {
	await interaction.deferReply();

	const url = 'https://solved.ac/search?query='+encodeURI(interaction.options.get('검색어')['value']);
	const response = await fetch(url);
	const data = await response.json();

	if (data['count'] == 0) {
		const searchEmbed = new EmbedBuilder()
			.setDescription(`:face_with_diagonal_mouth: **'${interaction.options.get('검색어')['value']}'에 대한 검색 결과가 없어요**`)
			.setColor('#0468BF');
		await interaction.editReply({ embeds: [searchEmbed] });
	} else {
		const searchEmbed = new EmbedBuilder()
			.setTitle(`📌 '${interaction.options.get('검색어')['value']}'을(를) 검색한 결과입니다`)
			.setColor('#0468BF');

		// Repeat up to 6 times
		let count = data['count'] <= 6 ? data['count'] : 6;
		for (let i=0; i<count; i++) {
			let item = data['items'][i];

			let tags = '';
			for (const tag of item['tags']) { tags += ` \`${tag['displayNames'][0]['name']}\``; }
			if (tags == '') { tags=' `(유형 없음)`' }

			searchEmbed.addFields({ 
				name: `${get_emoji(item['level'])} \`${item['problemId']}\` | ${item['titleKo']}`, 
				value: `- ${tags}`,
				inline: false
			});
		}

		// Make components
		const viewAllBtn = new ButtonBuilder()
			.setLabel(`전체 보기 (${data['count']}개)`)
			.setURL(url)
			.setStyle(ButtonStyle.Link);
		const row = new ActionRowBuilder().addComponents(viewAllBtn);

		await interaction.editReply({ embeds: [searchEmbed], components: [row] });
	}
}