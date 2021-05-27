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
            'Display the list of AnthonyBot\'s commands.'
          ],
          '2weeks `\'game\'`',
          [
            'Set yourself a reminder to play a game in 2 weeks.'
          ],
          'listen',
          [
            'Add AnthonyBot to the voice channel you\'re in.'
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

      case '2WEEKS':
        if (args.length === 0) {
          try {
            await message.reply('you forgot to mention the game, dummy :P');
          } catch (error) {
            console.log('2WEEKS ERROR 1 :>> ', error);
          }
          break;
        }

        try {
          await message.channel.send(`${message.author} promises to play **${args.join(' ')}** in 2 weeks if y'all are still playing it!`);
          setTimeout(async () => {
            await message.channel.send(`2 weeks have passed!! ${message.author}, you promised to play **${args.join(' ')}** if people are still playing it!`);
          }, TWO_WEEKS);
        } catch (error) {
          console.log('2WEEKS ERROR 2 :>> ', error);
        }
        break;

      case 'LISTEN': {
        const sourceVoiceChannel = message.member.voice.channel;
        if (!sourceVoiceChannel) {
          try {
            await message.reply('you fool. Do not even think to summon me unless you are in a voice channel >:(');
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
          await message.channel.send(`Sorry, \`${message.content.split(' ')[0]}\` is currently not a command :(`);
        } catch (error) {
          console.log('DEFAULT ERROR 1 :>> ', error);
        }
    }
  }
});

client.login(process.env.BOT_TOKEN);
