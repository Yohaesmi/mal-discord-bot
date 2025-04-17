import {SlashCommandBuilder, EmbedBuilder, MessageFlags} from 'discord.js';
import { findItem } from '../../func/mal/findItem.js';
import { fc } from '../../../func/misc.js';
import { mal } from '../../../api/mal/m.js';

export default {
  data: new SlashCommandBuilder()
		.setName('mal-search')
		.setDescription('Find info about anime/manga')
    .addStringOption(o =>
      o.setName('type')
      .setDescription('Anime/manga')
      .setRequired(true)
      .addChoices(
        { name: 'Anime', value: 'anime' },
        { name: 'Manga', value: 'manga' }
      )
    )
    .addStringOption(o =>
      o.setName('title')
      .setDescription('Anime/manga title')
      .setRequired(true)
    )
    .addBooleanOption(o =>
      o.setName('ephemeral')
        .setDescription('Ephemeral?')
        .setRequired(true)
    ),
	async execute(int){
    // console.log('II', int);
    const data = {
      type: int.options.getString('type'),
      title: int.options.getString('title'),
      ephemeral: int.options.getBoolean('ephemeral')
    };
    try{
      const res = await findItem(data.type, data.title);
      if(!res){
        return await int.reply({
          content: `MAL: ${data.type} ${data.title} не найдено!`,
          ...(data.ephemeral) && {flags: MessageFlags.Ephemeral}
        });
      }
      // console.log('RES', res);

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(res.mal.title)
      .setDescription(`Ссылки: [MAL](https://myanimelist.net/anime/${res.id}) / ${res.shiki && res.shiki.id && `[Shikimori](https://shikimori.one/animes/${res.shiki.id})`}
      Синонимы: ${res.mal.alternative_titles.synonyms?.map(e => '"'+e+'"')?.join(', ')||'-'}
      * RU: ${res.shiki?.russian||'-'}\n* EN: ${res.mal.alternative_titles.en||'-'}\n* JA: ${res.mal.alternative_titles.ja||'-'}`)
      .addFields(
        { name: 'Рейтинг', value: res.mal.mean.toString(), inline:true },
        { name: 'Ранг', value: res.mal.rank?.toString()||'-', inline: true },
        { name: 'Популярность', value: res.mal.popularity?.toString()||'-', inline: true },
        { name: 'Инфо', value: [
          '* Эпизодов: ',
          res.mal.num_episodes?.toString()||'?',
          '\n',
          '* Дата старта: ',
          res.mal.start_date,
          '\n',
          '* Статус: ',
          mal.titleStatus(res.mal.status),
          '\n',
          ...(!mal.titleStatus(res.mal.status).match(/Вышло|Закончено/)) ?
          ['* День выхода: по ',
          fc.weekDay(res.mal.broadcast.day_of_the_week, true),
          ' ',
          res.mal.broadcast.start_time]:[]
        ].join('') }
      )
      .setThumbnail(res.mal.main_picture.large);

      await int.reply({
        // content: 'Pong!',
        embeds:[embed],
        ...(data.ephemeral) && {flags: MessageFlags.Ephemeral}
      });
    }catch(err){
      console.log(err);
    }
	}
};