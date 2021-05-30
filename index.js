require('dotenv').config();
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', async () => {
  try {
    await client.user.setPresence({
      activity: {
        type: 'PLAYING',
        name: 'JS. Type \'>help\' for docs'
      }
    });
  } catch (error) {
    console.log('CLIENT ON READY ERROR 1 :>> ', error);
  }
  console.log(`${client.user.username} is on :)`);
});

client.on('message', async (message) => {
  // Commands
  const PREFIX = '>';
  if (message.content.startsWith(PREFIX)) {
    const content = message.content.toUpperCase();
    const [command, ...args] = content.substring(1).split(' ');
    const TWO_WEEKS = 1209600000;
    
    switch (command) {
      case 'HELP': {
        const docs = [
          'help',
          [
            `Display the list of ${client.user.username}'s commands.`
          ],
          '2weeks `<game>`',
          [
            '*Requires `<game>` argument.*',
            `Have ${client.user.username} set a reminder for you to play a specified game with the peeps in 2 weeks.`
          ],
          'listen',
          [
            '*Requires presence in a voice channel.*',
            `Allow ${client.user.username} to join your voice channel and make sure everyone is playing nice :)`
          ]
        ];

        const formattedDocs = docs
          .map((doc) => {
            if (typeof doc === 'string') {
              return `**>${doc}**`;
            }
            if (Array.isArray(doc)) {
              return doc.map((paragraph) => `\t\t${paragraph}`);
            }
            return doc;
          })
          .flat()
          .join('\n');

        try {
          await message.channel.send(formattedDocs);
        } catch (error) {
          console.log('HELP ERROR 1 :>> ', error);
        }
        break;
      }

      case '2WEEKS': {
        const game = args.join(' ');
        if (game.length === 0) {
          try {
            await message.channel.send(`\`ERROR: Missing <game> argument.\`\n${message.author}, what game would you like me to set a 2 week reminder for?`);
          } catch (error) {
            console.log('2WEEKS ERROR 1 :>> ', error);
          }
          break;
        }

        try {
          await message.reply(`you got it! I'll remind you to play **${game}** with the peeps in 2 weeks :)`);
          setTimeout(async () => {
            await message.reply(`yo here's your 2 week reminder to play **${game}** with the peeps. Have fun :)`);
          }, TWO_WEEKS);
        } catch (error) {
          console.log('2WEEKS ERROR 2 :>> ', error);
        }
        break;
      }

      case 'LISTEN': {
        const sourceVoiceChannel = message.member.voice.channel;
        if (!sourceVoiceChannel) {
          try {
            await message.channel.send(`\`ERROR: No presence in a voice channel detected.\`\n${message.author}, please join a voice channel first.`);
          } catch (error) {
            console.log('LISTEN ERROR 1 :>> ', error);
          }
          break;
        }

        const botAvailable = !client.voice.connections.some((connection) => connection.channel.id === sourceVoiceChannel.id);
        if (botAvailable) {
          try {
            await sourceVoiceChannel.join();
          } catch (error) {
            console.log('LISTEN ERROR 2 :>> ', error);
          }
        }
        break;
      }

      default:
        try {
          await message.reply(`\`${message.content.split(' ')[0]}\` is currently not a command :(`);
        } catch (error) {
          console.log('DEFAULT ERROR 1 :>> ', error);
        }
    }
  }
});

client.login(process.env.BOT_TOKEN);
