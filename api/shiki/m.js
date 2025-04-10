import axios from "axios";

export const shiki = {
  url: 'https://shikimori.one/api/graphql',
  fetch: function(o){
    return axios(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': process.env.shikiApp
      },
      data: {
        query: o.graph
      }
    }).then(
        res => {
            // console.log('res', res.data);
            return res.data;
        },
        err => {
          console.log('Err', err);
          return err.response.data;
        }
    )
  },
  search: function(o){
    o.graph = `{
      animes (search: "${o.q}", limit: ${o.limit}, kind: "!special"){
        id
        malId
        name
        russian
        licenseNameRu
        english
        japanese
        synonyms
        kind
        rating
        score
        status
        episodes
        episodesAired
        duration
        airedOn { year month day date }
        releasedOn { year month day date }
        url
        season
        poster { id originalUrl mainUrl }
        fansubbers
        fandubbers
        licensors
        createdAt,
        updatedAt,
        nextEpisodeAt,
        isCensored
        genres { id name russian kind }
        studios { id name imageUrl }
        externalLinks {
          id
          kind
          url
          createdAt
          updatedAt
        }
        personRoles {
          id
          rolesRu
          rolesEn
          person { id name poster { id } }
        }
        characterRoles {
          id
          rolesRu
          rolesEn
          character { id name poster { id } }
        }
        related {
          id
          anime {
            id
            name
          }
          manga {
            id
            name
          }
          relationKind
          relationText
        }
        videos { id url name kind playerUrl imageUrl }
        screenshots { id originalUrl x166Url x332Url }
        scoresStats { score count }
        statusesStats { status count }
        description
        descriptionHtml
        descriptionSource
      }
    }`;

    return this.fetch(o);
  }
}