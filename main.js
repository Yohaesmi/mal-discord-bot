import 'dotenv/config';
import {Client, Events, GatewayIntentBits, EmbedBuilder, WebhookClient} from 'discord.js';
import { mal } from './mal/m.js';
import { shiki } from './shiki/m.js';

const bot = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent] }
);

// shiki.fetch({
//   q: title,
//   limit: 10
// }).then(
//   res => {
//     if(!res) return;
//     console.log('[SHIKI]', res.data.animes);
//   }
// );

bot.once(Events.ClientReady, e => {
	console.log(`Ready! Logged in as ${e.user.tag}`);
});

bot.on('messageCreate', async msg => {
    console.log('NEW MSG!', msg.content);
    const filter = /^-ml `(?<title>[^`]+)`/gm;
    if(msg.content.match(filter)){
      let title;
      msg.content.replace(filter, (_, ttl) => title = ttl);
      // console.log('MSG', msg);
      const channel = bot.channels.cache.get(msg.channelId);
      const webhooks = await channel.fetchWebhooks();
      let wh;
      const whHere = webhooks.find(w => w.name === 'MAL');
      if(!whHere){
        wh = await channel.createWebhook({
          name: 'MAL',
          avatar: 'https://i.imgur.com/AfFp7pu.png',
        });
        // msg.reply('Вебхук не найден. Вебхук создан, повторите запрос');
      }else wh = whHere;
      // console.log('WH', webhooks);

      const sh = {
        s: await shiki.search({
            q: title,
            limit: 10
          })
        };
      if(sh.s){
        for(let e of sh.s.data.animes){
          if(e.name === title){
            console.log('RRR', e.russian);
            sh.result = e;
            break;
          }
        }
        // sh.s.data.animes.some(e => {
        //   if(e.name === title){
        //     console.log('RRR', e.russian);
        //     sh.result = e;
        //     // return;
        //   }
        // })
      };

      mal.search({
        query: {
          q: title,
          limit: 20,
          nsfw: true
        }
      }).then(
        res => {
          console.log('[MAL]', res);
          if(!res) return;
          res.data.forEach(e => {
            console.log(e.node);
            if(e.node.title === title){
              console.log('Founded!', e.node);
              mal.get({
                value: e.node.id,
                query: {
                  fields: ['id', 'title', 'rank', 'popularity', 'alternative_titles']
                }
              }).then(
                res => {
                  // const wh = new WebhookClient({ url: 'https://discord.com/api/webhooks/1321787314808295496/TJAdv1MfCemVgZjvV0g902AMTVLiB1rmeAtoT0bCdHXKQc3meXo-c5ITlYrlJvi_Ti9M' });
                  console.log('[MAL]', res);
                  // console.log('ID', res.id);

                  const embed = new EmbedBuilder()
                  .setColor(0x0099FF)
                  .setTitle(res.title)
                  .setDescription(`Ссылки: [MAL](https://myanimelist.net/anime/${res.id}) / ${sh.result && sh.result.id && `[Shikimori](https://shikimori.one/animes/${sh.result?.id})`}
                  Синонимы: ${res.alternative_titles.synonyms?.map(e => '"'+e+'"')?.join(', ')||'-'}
                  RU: ${sh.result?.russian||'-'}
                  EN: ${res.alternative_titles.en||'-'}
                  JA: ${res.alternative_titles.ja||'-'}`)
                  .setThumbnail(res.main_picture.large)
                  .addFields(
                    // { name: 'Synonims', value: res.alternative_titles.synonyms.map(e => '"'+e+'"').join(', ') },
                    // { name: 'EN', value: res.alternative_titles.en },
                    // { name: 'JA', value: res.alternative_titles.ja },
                    // { name: '\u200B', value: '\u200B' },
                    { name: 'ID', value: res.id.toString(), inline:true },
                    { name: 'Rank', value: res.rank?.toString()||'-', inline: true },
                    { name: 'Popularity', value: res.popularity?.toString()||'-', inline: true },
                  );
                  wh.send({
                    // content: 'Webhook test',
                    username: 'MAL',
                    avatarURL: 'https://i.imgur.com/AfFp7pu.png',
                    embeds: [embed],
                  });
                },
                err => {
                  console.log('[MAL]', err);
                }
              )
            }
          })
        },
        err => {
          console.error('[MAL]', err);
        }
      )
        // msg.reply('Lol!');
    }
})

// Log in to Discord with your client's token
bot.login(process.env.TOKEN);