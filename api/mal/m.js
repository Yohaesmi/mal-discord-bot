import 'dotenv/config';
import axios from 'axios';

export const mal = {
  titleStatus: function(status){
    console.log('STATUS', status);
    if(!status) return;
    const s = {
      currently_airing: 'Выходит',
      currently_publishing: 'Публикуется',
      finished_airing: 'Вышло',
      finished_publishing: 'Закончено'
    }
    return s[status]||status;
  },
  url: 'https://api.myanimelist.net/v2',
  fetch: function(o){
    return axios(`${this.url}/${o.type}${o.value && `/${o.value}`||''}?${o.query && new URLSearchParams(o.query).toString()||''}`, {
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
    o.headers = {
      'X-MAL-CLIENT-ID': process.env.malID
    }
    return this.fetch(o);
  },
  get: function(o){
    o.query.fields = o.query.fields.join(',');
    o.headers = {
      'X-MAL-CLIENT-ID': process.env.malID
    }
    return this.fetch(o);
  }
}