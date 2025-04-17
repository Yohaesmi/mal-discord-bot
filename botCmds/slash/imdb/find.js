import { SlashCommandBuilder, ApplicationCommandType, EmbedBuilder, MessageFlags } from 'discord.js';
import { fc } from '../../../func/misc.js';
import { findItemImdb } from '../../func/imdb/findItem.js';

export default {
  data: new SlashCommandBuilder()
	.setName('imdb-search')
  .setDescription('Find info about film/series')
  .addStringOption(o =>
    o.setName('title')
    .setDescription('Film/series title')
    .setRequired(true)
  )
  .addBooleanOption(o =>
    o.setName('ephemeral')
      .setDescription('Ephemeral?')
      .setRequired(true)
  ),
  async execute(int){
		const data = {
      title: int.options.getString('title'),
      ephemeral: int.options.getBoolean('ephemeral')
    };

    try{
      const res = await findItemImdb(data.title);
      if(!res){
        return await int.reply({
          content: `IMDB: ${data.title} не найдено!`,
          ...(data.ephemeral) && {flags: MessageFlags.Ephemeral}
        });
      }
      // console.log('RES', res);

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(res.imdb.Title)
      .setDescription(`Ссылка: [IMDB](https://www.imdb.com/title/${res.imdb.imdbID}/)`)
      // .setThumbnail(res.imdb.Poster)
      .addFields(
        // { name: 'Synonims', value: res.alternative_titles.synonyms.map(e => '"'+e+'"').join(', ') },
        { name: 'Тип', value: res.imdb.Type, inline:true },
        { name: 'Год', value: res.imdb.Year?.toString()||'-', inline:true },
        { name: 'Длительность', value: res.imdb.Runtime, inline:true },
        { name: 'Жанр', value: res.imdb.Genre },
        // { name: '\u200B', value: '\u200B' },
        { name: 'Рейтинги', value: res.imdb.ratings },
        // { name: 'Рейтинг', value: res.imdbRating.toString(), inline:true },
        { name: 'Голоса', value: res.imdb.imdbVotes?.toString()||'-', inline: true }
      );
      if(res.imdb.Poster !== 'N/A') embed.setThumbnail(res.imdb.Poster);

      await int.reply({
        // content: 'Pong!',
        embeds:[embed],
        ...(data.ephemeral) && {flags: MessageFlags.Ephemeral}
      });
    } catch(err){
      console.log(err);
    }
  }
}