import dotenv from "dotenv";
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
    Client, Collection,
    GatewayIntentBits, PermissionFlagsBits, ButtonStyle,
    EmbedBuilder, ButtonBuilder, ActionRowBuilder
} from 'discord.js';
import jsonObj from './package.json' assert { type: 'json' };
import { deploySlashCommands } from './utils/deployCommand.js';
import { logging } from './utils/loggingCh.js';

// basic declare
dotenv.config();
const version = jsonObj.version;
const __dirname = resolve();

// another way to load json data
// const rawdata = readFileSync('./package.json');
// const version = JSON.parse(rawdata)['version'];

// declare client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});
client.commands = new Collection();


// Get slashcommands and deploy
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
	const filePath = `file://${join(commandsPath, file)}`;
    const command = await import(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}
deploySlashCommands(client, commands);


// Events start
client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    logging(client, 'Bot Started', `**Version**: ${version}\n**Server**: ${client.guilds.cache.size}`);

    //activity loop
    let indexNum = 0;
    let preMsgs = [
        `버전 - ${version}`,
        '백준 문제 풀이'
    ];
    setInterval(() => {
        client.user.setActivity(preMsgs[indexNum]);
        indexNum = (indexNum+1) % preMsgs.length;
    }, 5000);
});

client.on('guildCreate', async (guild) => {
    let member = guild.members.cache.get(client.user.id);
    const keywords = ['공지', 'noti', '채팅', '일반', '광장', 'chat', 'general', '봇', 'bot'];

    let noticeChannel;
    forChannels: for (let channel of guild.channels.cache) {
        if (channel[1].type == 0) {
            if (channel[1].permissionsFor(member).has(PermissionFlagsBits.SendMessages)) {
                if (!noticeChannel) { noticeChannel = channel[1] }
                for (let i=0;i<keywords.length;i++) {
                    if (channel[1].name.includes(keywords[i])){
                        noticeChannel = channel[1];
                        break forChannels;
                    }
                }
            }
        }
    }

    let commandsMention = '';
    for (let command of client.data) { commandsMention += `</${command.name}:${command.id}> ` }
    
    const helloEmbed = new EmbedBuilder()
        .setTitle('👋 반가워요!')
        .setDescription('서버에 초대해주셔서 감사해요.\n저는 **비공식 백준 학습 도우미**봇입니다. ✏️')
        .setThumbnail('https://i.pinimg.com/originals/75/62/6c/75626cca09ae5242b97c8713f2c6326a.png')
        .setColor('#0468BF')
        .addFields({ name: '💻 명령어', value: commandsMention });

	const githubBtn = new ButtonBuilder()
		.setLabel('깃허브')
		.setEmoji('<:github:1140869819730755714>')
		.setURL('https://github.com/KeuHeum/baekjoon-discord-bot')
		.setStyle(ButtonStyle.Link);

	const row = new ActionRowBuilder().addComponents(githubBtn);

    await noticeChannel.send({ embeds: [helloEmbed], components: [row] });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching '${interaction.commandName}' was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '명령어를 실행하는 동안 오류가 발생했어요', ephemeral: true });
        } else {
            await interaction.reply({ content: '명령어를 실행하는 동안 오류가 발생했어요', ephemeral: true });
        }
    }
});


client.login(process.env.TOKEN);