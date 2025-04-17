import { imdb } from "../../../api/imdb/m.js";

export async function findItemImdb(title){
  const fixer = (text) => text.toLowerCase();
  return imdb.search({
    query: {
      t: fixer(title)
    }
  }).then(
    res => {
      console.log('[IMDB]', res);
      if(res.Response === 'False') return false;

      const rt = (res) => {
        let t = '';
        res.forEach(e => {
            t += `* ${e.Source} ${e.Value}\n`
        });
        return t;
      };

      return {
        imdb: {
          ...res,
          ratings: rt(res.Ratings)
        }
      }
    })
  }