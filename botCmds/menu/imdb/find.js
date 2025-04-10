import { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, MessageFlags } from 'discord.js';
import { fc } from '../../../func/misc.js';
import { findItemImdb } from '../../func/imdb/findItem.js';

export default {
  data: new ContextMenuCommandBuilder()
	.setName('IMDB: Get film/series info')
	.setType(ApplicationCommandType.Message),
  async execute(int){
		const msg = int.targetMessage;
		const filter = /^- `(?<title>[^`]+)`/gm;
		if(!msg.content) return;
		if(!msg.content.match(filter)) return;
		let title, type;
		msg.content.replace(filter, (_, ttl) => {
			title = ttl;
			// type = (typ === 'a') ? 'anime' : 'manga';
		});

    try{
      const res = await findItemImdb(title);
      console.log('RES', res);
      if(res.error) return await int.reply({
        content: `[IMDB] ${res.error}`,
        flags: MessageFlags.Ephemeral
      });

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
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      });
    } catch(err){
      console.log(err);
    }
  }
}