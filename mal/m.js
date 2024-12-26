import 'dotenv/config';
import axios from 'axios';

export const mal = {
    url: 'https://api.myanimelist.net/v2',
    fetch: function(o){
      return axios(`${this.url}/${o.q}${o.value && `/${o.value}`||''}?${o.query && new URLSearchParams(o.query).toString()||''}`, {
        method: o.method||'get',
        headers: {
          'Content-Type': 'application/json',
          ...o.headers
        },
        ...(o.data) && {body: JSON.stringify(o.data)}
      }).then(
        res => {
          // console.log('[Fetch]', res.data);
          return res.data;
        },
        err => {
          console.log('[Fetch] ERR', err.response.data);
          return err.response.data;
        }
      )
    },
    search: function(o){
      o.q = 'anime';
      // o.url = this.url;
      // o.method = 'POST';

      console.log('QQQ', `https://api.myanimelist.net/v2/${o.q}?${o.query && new URLSearchParams(o.query).toString()||''}`)

      // o.query = {
      //   q: 'Jujitsu',
      //   limit: 4
      // }

      o.headers = {
        'X-MAL-CLIENT-ID': process.env.malID
      }
      return this.fetch(o);
    },
    get: function(o){
      o.q = 'anime';
      o.query.fields = o.query.fields.join(',');

      o.headers = {
        'X-MAL-CLIENT-ID': process.env.malID
      }
      return this.fetch(o);
    }
}