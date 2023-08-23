import fetch from 'node-fetch';
import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { get_emoji, get_color, get_level } from '../utils/level.js';

export const data = new SlashCommandBuilder()
	.setName('유저')
	.setDescription('유저명을 통해 solved.ac 유저의 정보를 보내줘요')
	.addStringOption(option => option
		.setName('유저명')
		.setDescription('유저의 이름을 입력해주세요')
		.setMaxLength(20) // todo: find nickname min&max length
		.setRequired(true)
	);

export async function execute(interaction) {
	await interaction.deferReply();

	const url = 'https://solved.ac/api/v3/user/show?handle='+encodeURI(interaction.options.get('유저명')['value']);
	const response = await fetch(url);
	
	if (response.status == 400) {
		const searchEmbed = new EmbedBuilder()
			.setDescription(`:exploding_head: **유저명 '${interaction.options.get('유저명')['value']}'이 잘못되었어요**`)
			.setFooter({ text: '정확한 유저명을 입력해주세요' })
			.setColor('#0468BF');
		await interaction.editReply({ embeds: [searchEmbed] });

	} else if (response.status == 404) {
		const searchEmbed = new EmbedBuilder()
			.setDescription(`:confounded: **유저 '${interaction.options.get('유저명')['value']}'에 대한 검색 결과가 없어요**`)
			.setColor('#0468BF');
		await interaction.editReply({ embeds: [searchEmbed] });
			
	} else if (response.status == 200) {
		const item = await response.json();

		const bgResponse = await fetch(`https://solved.ac/api/v3/background/show?backgroundId=${item['backgroundId']}`);
		const bgData = await bgResponse.json();
		
		const userEmbed = new EmbedBuilder()
			.setTitle(`${item['handle']}님의 정보`)
			.setColor(`#${get_color(item['tier'])}`)
			.setThumbnail(item['profileImageUrl'])
			.setImage(bgData['backgroundImageUrl'])
			.setFields(
				{ name: '티어', value: `${get_emoji(item['tier'])} ${get_level(item['tier'])}`, inline: true },
				{ name: '순위', value: `${item['rank']}위`, inline: true },
				{ name: '해결한 문제', value: `${item['solvedCount']}개`, inline: true },
				{ name: '최대 연속 풀이', value: `${item['maxStreak']}일`, inline: true },
				{ name: '가입일', value: `<t:${Math.floor(new Date(item['joinedAt']).getTime() / 1000)}:d>`, inline: true },
			);
		
		if (item['bio'] != ''){
			userEmbed.setDescription(item['bio']);
		}
		if (item['voteCount'] != 0) {
			userEmbed.addFields({ name: '기여한 문제', value: `${item['voteCount']}개`, inline: true });
		}
		if (item['class'] != 0) {
			userEmbed.addFields({ name: '취득한 클래스', value: `${item['class']}개`, inline: true });
		}
		const bannedDate = Math.floor(new Date(item['bannedUntil']).getTime() / 1000);
		if (bannedDate != 0) {
			userEmbed.addFields({ name: '정지 종료일', value: `<t:${bannedDate}:d>`, inline: true });
		}

		// Profile link btns
		const solvedBtn = new ButtonBuilder()
			.setLabel('solved.ac')
			.setEmoji('<:solved_ac_logo:1143823018422976543>')
			.setURL(`https://solved.ac/profile/${item['handle']}`)
			.setStyle(ButtonStyle.Link);

		const bojBtn = new ButtonBuilder()
			.setLabel('baekjoon')
			.setEmoji('<:boj_icon:1143862157423947917>')
			.setURL(`https://www.acmicpc.net/user/${item['handle']}`)
			.setStyle(ButtonStyle.Link);

		const row = new ActionRowBuilder()
			.addComponents(solvedBtn)
			.addComponents(bojBtn);

		await interaction.editReply({ embeds: [ userEmbed ], components: [row] });
	}
}