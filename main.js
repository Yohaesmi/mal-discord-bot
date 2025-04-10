import 'dotenv/config';
import {Client, Events, GatewayIntentBits, MessageFlags} from 'discord.js';
import { pusher } from './botCmds/pusher.js';

const bot = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent] }
);

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
        await int.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral
        });
      }else{
        await int.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral
        });
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
        await int.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral
        });
      }else{
        await int.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral
        });
      }
    }
  }
});

bot.login(process.env.DiscordToken);