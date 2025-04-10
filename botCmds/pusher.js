import 'dotenv/config';
import {REST, Routes, Collection} from 'discord.js';
import {default as malFindMenu} from './menu/mal/find.js';
import {default as malFindSlash} from './slash/mal/find.js';
import {default as imdbFindMenu} from './menu/imdb/find.js';
import {default as imdbFindSlash} from './slash/imdb/find.js';

export async function pusher(bot, full){
  if(full){
    bot.commands = new Collection();
    [
      malFindSlash,
      malFindMenu,
      imdbFindSlash,
      imdbFindMenu
    ].forEach(e => {
      bot.commands.set(e.data.name, e);
    });
  }
  const cmds = [];
  [
    malFindSlash,
    malFindMenu,
    imdbFindSlash,
    imdbFindMenu
  ].forEach(e => {
    cmds.push(e.data.toJSON());
  });


  const rest = new REST().setToken(process.env['DiscordToken']);
  bot.guilds.cache.forEach(async e => {
    try{
      console.log(`Started refreshing ${cmds.length} application (/) commands.`);
      const data = await rest.put(
        Routes.applicationGuildCommands(process.env['DiscordID'], e.id),
        { body: cmds },
      );

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }catch (error){
      console.error(error);
    }
  })
}