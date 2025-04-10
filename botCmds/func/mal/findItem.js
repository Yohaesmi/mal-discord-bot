import { mal } from "../../../api/mal/m.js";
import { shiki } from "../../../api/shiki/m.js";

export async function findItem(type, title){
  console.log('FIND', {type:type, title:title});
  const api = {
    shiki: await shiki.search({
      q: title,
      type: type,
      limit: 10
    }),
    mal: mal.search({
      type: type,
      query: {
        q: title.slice(0, 64),
        limit: 20,
        nsfw: true
      }
    })
  };
  if(api.shiki){
    for(let e of api.shiki.data.animes){
      if(e.name === title){
        console.log('RRR', e.russian);
        api.result = e;
        break;
      }
    }
  };

    return mal.search({
      type: type,
      query: {
        q: title.slice(0, 64),
        limit: 20,
        nsfw: true
      }
    }).then(
      res => {
        // console.log('[MAL]', res);
        if(!res) return;
        for(const e of res.data){
          if(e.node.title !== title) continue;
          console.log('Founded!', e.node);
          return mal.get({
            value: e.node.id,
            type: type,
            query: {
              fields: [
                'id',
                'title',
                'rank',
                'popularity',
                'score',
                'mean',
                'status',
                'broadcast',
                'statistics',
                'start_date',
                'num_episodes',
                'alternative_titles'
              ]
            }
          }).then(
            res => {
              return {
                shiki: api.result,
                mal: res
              }
              // const wh = new WebhookClient({ url: 'https://discord.com/api/webhooks/1321787314808295496/TJAdv1MfCemVgZjvV0g902AMTVLiB1rmeAtoT0bCdHXKQc3meXo-c5ITlYrlJvi_Ti9M' });
              console.log('[MAL]', res);
              // console.log('ID', res.id);

              // [
              //   '* Эпизодов: ',
              //   res.num_episodes?.toString()||'?',
              //   '\n',
              //   '* Дата старта: ',
              //   res.start_date,
              //   '\n',
              //   '* Статус: ',
              //   fc.titleStatus[res.status],
              //   '\n',
              //   ...(fc.titleStatus[res.status].match('Вышло'||'Закончено')) ?
              //   ['* День выхода: по ',
              //   fc.weekDay(res.broadcast.day_of_the_week, true),
              //   ' ',
              //   res.broadcast.start_time]:[]
              // ]

              const embed = new EmbedBuilder()
              .setColor(0x0099FF)
              .setTitle(res.title)
              .setDescription(`Ссылки: [MAL](https://myanimelist.net/anime/${res.id}) / ${api.result && api.result.id && `[Shikimori](https://shikimori.one/animes/${api.result?.id})`}
              Синонимы: ${res.alternative_titles.synonyms?.map(e => '"'+e+'"')?.join(', ')||'-'}
              * RU: ${api.result?.russian||'-'}\n* EN: ${res.alternative_titles.en||'-'}\n* JA: ${res.alternative_titles.ja||'-'}`)
              .setThumbnail(res.main_picture.large)
              .addFields(
                // { name: 'Synonims', value: res.alternative_titles.synonyms.map(e => '"'+e+'"').join(', ') },
                // { name: 'EN', value: res.alternative_titles.en },
                // { name: 'JA', value: res.alternative_titles.ja },
                // { name: '\u200B', value: '\u200B' },
                // { name: 'ID', value: res.id.toString(), inline:true },
                { name: 'Рейтинг', value: res.mean.toString(), inline:true },
                { name: 'Ранг', value: res.rank?.toString()||'-', inline: true },
                { name: 'Популярность', value: res.popularity?.toString()||'-', inline: true },
                // { name: '\u200B', value: '\u200B' },
                // { name: 'Эпизодов', value: res.num_episodes.toString(), inline:true },
                // { name: 'Дата старта', value: res.start_date, inline:true },
                // { name: 'Статус', value: getStatus[res.status]||res.status, inline:true },
                { name: 'Инфо', value: `
                  * Эпизодов: ${res.num_episodes?.toString()||'?'}
* Дата старта: ${res.start_date}
* Статус: ${fc.titleStatus[res.status]||res.status}
* День выхода: по ${fc.weekDay(res.broadcast.day_of_the_week, true)}, ${res.broadcast.start_time}` }
                // { name: '\u200B', value: '\u200B' },
                // { name: 'Rank', value: res.rank?.toString()||'-', inline: true },
                // { name: 'Popularity', value: res.popularity?.toString()||'-', inline: true },
              );
              int.reply({
                // content: 'Webhook test',
                embeds: [embed],
                flags: MessageFlags.Ephemeral
              });
            },
            err => {
              console.error('[MAL]', err);
            }
          )
        }
      },
      err => {
        console.error('[MAL]', err);
      }
    )
}