import 'dotenv/config';
import {Client, Events, Collection, GatewayIntentBits, MessageFlags} from 'discord.js';

import {default as malFindMenu} from './botCmds/menu/mal/find.js';
import {default as malFindSlash} from './botCmds/slash/mal/find.js';
import {default as imdbFindMenu} from './botCmds/menu/imdb/find.js';
import {default as imdbFindSlash} from './botCmds/slash/imdb/find.js';
import { pusher } from './botCmds/push.js';

const bot = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent] }
);
// bot.commands = new Collection();

// [
//   malFindSlash,
//   malFindMenu,
//   imdbFindSlash,
//   imdbFindMenu
// ].forEach(e => {
//   bot.commands.set(e.data.name, e);
// });

bot.once(Events.ClientReady, e => {
	console.log(`Ready! Logged in as ${e.user.tag}`);
  pusher(bot, true);
});

bot.on(Events.GuildCreate, async guild => {
  pusher(bot);
});

bot.on(Events.InteractionCreate, async int => {
  if(int.isChatInputCommand()){
    const cmd = int.client.commands.get(int.commandName);

    try{
      await cmd.execute(int);
    }catch (error){
      console.error(error);
      if(int.replied||int.deferred){
        await int.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
      }else{
        await int.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
      }
    }
  }else
  if(int.isMessageContextMenuCommand()){
    const cmd = int.client.commands.get(int.commandName);

    try{
      await cmd.execute(int);
    }catch (error){
      console.error(error);
      if(int.replied||int.deferred){
        await int.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
      }else{
        await int.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
      }
    }
  }
});

// bot.on('messageCreate', async msg => {
//   if(msg.author.bot) return;
//   // console.log('NEW MSG!', `${msg.id},${msg.channel.id}, ${msg.content}`);
//   // console.log('NEW MSG!!!', msg);
//   // console.log('ROLE', msg.mentions.roles.first());
//   const role = msg.mentions.roles.first();
//   // console.log('R', role);
//   if(role && role.name === 'MAL') find(msg, bot);
//   else
//   if(role && role.name === 'IMDB') findIMDB(msg, bot);
//   else
//   if(msg.content.startsWith('-p')){
//     const voiceChannel = msg.member.voice.channel;
//     if (!voiceChannel) return msg.channel.send("Прошу прощения, но для прослушивания музыки вам нужно находиться в голосовом канале.");
//     const permissions = voiceChannel.permissionsFor(msg.client.user);
//     if (!permissions.has("CONNECT")) {
//       return msg.channel.send("Sorry, but I need **`CONNECT`** permissions to proceed!");
//     }
//     if (!permissions.has("SPEAK")) {
//       return msg.channel.send("Sorry, but I need **`SPEAK`** permissions to proceed!");
//     }
//   }
// })

// Log in to Discord with your client's token
bot.login(process.env.DiscordTOKEN);