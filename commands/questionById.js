import fetch from 'node-fetch';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { get_level, get_icon, get_color } from '../utils/level.js';

export const data = new SlashCommandBuilder()
	.setName('문제')
	.setDescription('문제 id를 통해 문제의 정보와 링크를 찾아요')
	.addIntegerOption(option => option
		.setName('id')
		.setDescription('백준 문제의 id를 입력해주세요')
		.setRequired(true)
	)
	.addBooleanOption(option => option
		.setName('스레드')
		.setDescription('문제 스레드를 만들지 결정해요')
		.setRequired(false)
	);

export async function execute(interaction) {
	await interaction.deferReply();

	const response = await fetch('https://www.acmicpc.net/problem/'+interaction.options.get('id')['value']);

	if (response.status == 400) {
		const searchEmbed = new EmbedBuilder()
			.setDescription(`:exploding_head: **'${interaction.options.get('id')['value']}번 문제'의 아이디가 잘못되었어요**`)
			.setFooter({ text: '정확한 id를 입력해주세요' })
			.setColor('#0468BF');
		await interaction.editReply({ embeds: [searchEmbed] });

	} else if (response.status == 404) {
		const searchEmbed = new EmbedBuilder()
			.setDescription(`:confounded: **'${interaction.options.get('id')['value']}번 문제'에 대한 검색 결과가 없어요**`)
			.setColor('#0468BF');
		await interaction.editReply({ embeds: [searchEmbed] });
			
	} else if (response.status == 200) {
		const item = await response.json();

		const problemEmbed = new EmbedBuilder()
			.setTitle(item['titleKo'])
			.setColor(`#${get_color(item['level'])}`)
			.setThumbnail(get_icon(item['level']))
			.setFields(
				{ name: '번호', value: `${item['problemId']}`, inline: false },
				{ name: '난이도', value: get_level(item['level']), inline: false }
			);

		// add tags
		let tags = '';
		for (const tag of item['tags']) { tags += ` \`${tag['displayNames'][0]['name']}\``; }
		if (tags != '') { problemEmbed.addFields({ name: '유형', value: tags, inline: false }) }

		// Problem link btn
		const problemBtn = new ButtonBuilder()
			.setLabel('문제 링크')
			.setURL(`https://www.acmicpc.net/problem/${item['problemId']}`)
			.setStyle(ButtonStyle.Link);
		const row = new ActionRowBuilder().addComponents(problemBtn);

		let msg = await interaction.editReply({ embeds: [ problemEmbed ], components: [row] });

		// Make thread If option is true
		let threadOpt = interaction.options.get('스레드')
		if (threadOpt != null && threadOpt['value'] == true){
			await msg.startThread({
				name: `${item['problemId']}번. ${item['titleKo']}`,
				type: 'GUILD_PUBLIC_THREAD'
			});
		}
	}
}
