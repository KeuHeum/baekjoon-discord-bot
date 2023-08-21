import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import jsonObj from '../package.json' assert { type: 'json' };

export const data = new SlashCommandBuilder()
	.setName('정보')
	.setDescription('봇의 정보를 전송해요');
	
export async function execute(interaction) {
	await interaction.deferReply();

	const reply = await interaction.fetchReply();
	const ping = reply.createdTimestamp - interaction.createdTimestamp;
	
	let uptime = '';
	let totalSeconds = (interaction.client.uptime / 1000);
	let days = Math.floor(totalSeconds / 86400);
	uptime += (days == 0) ? '':`${days}일 `;
	totalSeconds %= 86400;
	let hours = Math.floor(totalSeconds / 3600);
	uptime += (hours == 0) ? '':`${hours}시간 `;
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	uptime += (minutes == 0) ? '':`${minutes}분 `;
	let seconds = Math.floor(totalSeconds % 60);
	uptime += (seconds == 0) ? '':`${seconds}초`;

	const infoEmbed = new EmbedBuilder()
		.setTitle('💡 봇의 정보를 알려드릴게요')
		.setDescription('현재 사용하고 계신 봇은 **비공식 백준 학습 도우미**봇입니다.\n'+
						'[백준 규칙](https://help.acmicpc.net/rule)에 따라 문제 발생시 봇이 작동을 중단할 수 있습니다.')
		.setThumbnail('https://i.pinimg.com/originals/75/62/6c/75626cca09ae5242b97c8713f2c6326a.png')
		.setColor('#0468BF')
		.addFields({ name: '🏓 핑', value: `${ping}ms`, inline: true })
		.addFields({ name: '🛠 현재 버전', value: jsonObj.version, inline: true })
		.addFields({ name: '⚙ 작동 시간', value: uptime.trim(), inline: true })
		.addFields({ 
			name: '💎 특별한 감사', 
			value: '현재 프로젝트는 아래 사이트를 참고하여 만들어졌습니다.\n'+
				   '- [solvedac 비공식 API 문서](https://solvedac.github.io/unofficial-documentation/)\n'+
				   '- [DPY로 제작한 백준봇 설명 블로그](https://velog.io/@gyeongmin/%EB%B0%B1%EC%A4%80%EB%B4%87)\n'+
				   ' - [해당 봇의 소스코드](https://github.com/gyeongminn/baekjoonbot)',
			inline: false
		});
		// .setFooter({ text: 'keuheum_ · 제작자', iconURL: 'https://cdn.discordapp.com/avatars/604983644733440001/545f6be5e43249c79204416587af8ce3.webp' })
		// .setTimestamp();

	const inviteBtn = new ButtonBuilder()
		.setLabel('봇 초대하기')
		.setEmoji('🤖')
		.setURL('https://discord.com/api/oauth2/authorize?client_id=1139989151475843122&permissions=34359738368&scope=bot%20applications.commands')
		.setStyle(ButtonStyle.Link);

	const githubBtn = new ButtonBuilder()
		.setLabel('소스 보기')
		.setEmoji('<:github:1140869819730755714>')
		.setURL('https://github.com/KeuHeum/baekjoon-discord-bot')
		.setStyle(ButtonStyle.Link);

	const row = new ActionRowBuilder()
		.addComponents(inviteBtn)
		.addComponents(githubBtn);

	await interaction.editReply({ embeds: [infoEmbed], components: [row] });
}