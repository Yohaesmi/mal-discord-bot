import { mal } from "../../../api/mal/m.js";
import { shiki } from "../../../api/shiki/m.js";

export async function findItem(type, title){
  console.log('FIND', {type:type, title:title});
  const fixer = (text) => text.toLowerCase();
  const api = {
    shiki: await shiki.search({
      q: fixer(title),
      type: type,
      limit: 10
    }),
    mal: mal.search({
      type: type,
      query: {
        q: fixer(title.slice(0, 64)),
        limit: 20,
        nsfw: true
      }
    })
  };
  if(api.shiki){
    for(let e of api.shiki.data.animes){
      if(fixer(e.name) === fixer(title)){
        console.log('RRR', e.russian);
        api.result = e;
        break;
      }
    }
  };

    return mal.search({
      type: type,
      query: {
        q: fixer(title.slice(0, 64)),
        limit: 20,
        nsfw: true
      }
    }).then(
      res => {
        // console.log('[MAL]', res);
        if(!res) return;
        let founded;
        for(const e of res.data){
          if(fixer(e.node.title) !== fixer(title)) continue;
          founded = true;
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
            },
            err => {
              console.error('[MAL]', err);
            }
          )
        }
        if(founded) return false;
      },
      err => {
        console.error('[MAL]', err);
      }
    )
}