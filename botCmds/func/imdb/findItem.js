import { imdb } from "../../../api/imdb/m.js";

export async function findItemImdb(title){
  return imdb.search({
    query: {
      t: title
    }
  }).then(
    res => {
      console.log('[IMDB]', res);
      if(res.Response === 'False') return {imdb: {
        error: 'Film/series not found!'
      }
    };

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