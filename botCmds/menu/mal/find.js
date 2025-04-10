import { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, MessageFlags } from 'discord.js';
import { findItem } from '../../func/mal/findItem.js';
import { fc } from '../../../func/misc.js';
import { mal } from '../../../api/mal/m.js';

export default {
  data: new ContextMenuCommandBuilder()
	.setName('MAL: Get anime/manga info')
	.setType(ApplicationCommandType.Message),
  async execute(int){
		const msg = int.targetMessage;
		const filter = /^- `(?<title>[^`]+)`:(?<type>a|m)/gm;
		if(!msg.content) return;
		if(!msg.content.match(filter)) return;
		let title, type;
		msg.content.replace(filter, (_, ttl, typ) => {
			title = ttl;
			type = (typ === 'a') ? 'anime' : 'manga';
		});

    try{
      const res = await findItem(type, title);
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
          [
						'* День выхода: по ',
						fc.weekDay(res.mal.broadcast.day_of_the_week, true),
						' ',
						res.mal.broadcast.start_time
					]:[]
        ].join('') }
      )
      .setThumbnail(res.mal.main_picture.large);

      await int.reply({
        // content: 'Pong!',
        embeds:[embed],
        flags: MessageFlags.Ephemeral
      });
    }catch(err){
      console.log(err);
    }
	}
}