import { imdb } from "../../../api/imdb/m.js";

export default function findIMDB(msg, bot){
  if(!msg.content.match(filter)) return;
  let title;
  msg.content.replace(filter, (_, role, ttl) => title = ttl);

  imdb.search({
    query: {
      t: title
    }
  }).then(
    res => {
      console.log('[IMDB]', res);
      if(res.Response && res.Response === 'False') return msg.reply('[IMDB] Not found!');

      const rt = (res) => {
        let t = '';
        res.forEach(e => {
            t += `* ${e.Source} ${e.Value}\n`
        });
        return t;
      };

      const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(res.Title)
      .setDescription(`Ссылка: [IMDB](https://www.imdb.com/title/${res.imdbID}/)`)
      .setThumbnail(res.Poster)
      .addFields(
        // { name: 'Synonims', value: res.alternative_titles.synonyms.map(e => '"'+e+'"').join(', ') },
        { name: 'Тип', value: res.Type, inline:true },
        { name: 'Год', value: res.Year?.toString()||'-', inline:true },
        { name: 'Длительность', value: res.Runtime, inline:true },
        { name: 'Жанр', value: res.Genre },
        // { name: '\u200B', value: '\u200B' },
        { name: 'Рейтинги', value: rt(res.Ratings) },
        // { name: 'Рейтинг', value: res.imdbRating.toString(), inline:true },
        { name: 'Голоса', value: res.imdbVotes?.toString()||'-', inline: true },
        // { name: 'Популярность', value: res.popularity?.toString()||'-', inline: true },
        // { name: '\u200B', value: '\u200B' },
        // { name: 'Эпизодов', value: res.num_episodes.toString(), inline:true },
        // { name: 'Дата старта', value: res.start_date, inline:true },
        // { name: 'Статус', value: getStatus[res.status]||res.status, inline:true },
        // { name: 'Инфо', value: `* Эпизодов: ${res.num_episodes?.toString()||'?'}\n* Дата старта: ${res.start_date}\n* Статус: ${getStatus[res.status]||res.status}\n* День выхода: по ${wD(res.broadcast.day_of_the_week, true)}, ${res.broadcast.start_time}` }
        // { name: '\u200B', value: '\u200B' },
        // { name: 'Rank', value: res.rank?.toString()||'-', inline: true },
        // { name: 'Popularity', value: res.popularity?.toString()||'-', inline: true },
      );

      msg.reply({embeds:[embed]});
    }
  )
}