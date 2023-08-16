import dotenv from "dotenv";
import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Client, GatewayIntentBits, Collection, PermissionFlagsBits, ActivityType } from 'discord.js';
import jsonObj from './package.json' assert { type: 'json' };
import { deploySlashCommands } from './utils/deployCommand.js';

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
})

// client.on('guildCreate', async (guild) => {
//     let member = guild.members.cache.get(client.user.id);
//     const keywords = ['공지', 'noti', '채팅', '일반', '광장', 'chat', 'general', '봇', 'bot'];

//     function findNoticeChannel(channel) {
//         if (channel.type == 0
//             && channel.permissionFor(member).has(PermissionFlagsBits.SendMessages)) {
//             for (let i=0;i<keywords.length;i++) {
//                 if (channel.name.includes(keywords[i])){
//                     return true;
//                 }
//             }
//         }
//         return false;
//     }

//     console.log('ee')
//     console.log(guild.channels.cache.find(findNoticeChannel))
//     await guild.channels.cache.find(findNoticeChannel).send('ㅎㅇ')

//     // guild.channels.cache.forEach((channel) => {
//     //     if (channel.type == 0) {
//     //         console.log(channel.name);
//     //         if (channel.name.includes('테스트')) {
//     //             console.log("찾음");
//     //             return false;
//     //         }
//     //     }
//     // });

//     // console.log(guild.channels.cache.keys)
//     // for (const channel in guild.channels.cache.keys) {
//     //     console.log(channel)
//     //     if (channel.type == 0) {
//     //         console.log(channel.name)

//     //         if (channel.name.includes('테스트')) {
//     //             console.log("찾음");
//     //             break;
//     //         }
//     //     }

//         // if (channel.permissionFor(member).has('SEND_MESSAGE')) {
//         //     for (const keyword in keywords) {
//         //         if ((channel.name).includes(keyword)) {
//         //             console.log('ee')
//         //             await channel.send('ㅎㅇ')
//         //         }
//         //     }
//         // }
//     // }
// })

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
})


client.login(process.env.TOKEN);