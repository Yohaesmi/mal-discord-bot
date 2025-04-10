# Node.js Discord MAL/Shikimori/IMDB bot

Бот, отправляющий информацию о аниме/манге/фильме/сериале.

# Используется
* [MAL API](https://myanimelist.net/apiconfig/references/api/v2)
* [Shikimori API](https://shikimori.one/api/doc)
* [IMDB API](https://www.omdbapi.com/)

# ENV
* malID - ID вашего приложения
  * Создать можно [здесь](https://myanimelist.net/apiconfig)
    * **App Name** - имя приложения
    * **App Type** - Web
    * **Client ID** - malID. Будет получен после создания приложения
    * **App Redirect URL** - редирект ссылка
    * **Homepage URL** - домашняя страница. Redirect и homepage могут быть одинаковыми
    * **Commercial/Non-Commercia** - non-commercial
    * **Name/Company Name** - Никнейм/имя организации
    * **Purpose of Use** - hobbyist/other
  1) Нажимаем **Create ID**
  2) Вводим данные в форму. Используйте информацию выше
  3) Нажимаем **I agree to the API License and Developer Agreement**
  4) Нажимаем **Submit**
  5) Если у новосозданного приложения написано **PUBLISHED**, то всё, приложение создано.
  6) Нажмите на него и получите ваш Client ID (malID)
* ShikiID/ShikiSecret/ShikiApp - ID/Secret/имя приложения Shikimori
  * Получить можно [здесь](https://shikimori.one/oauth/applications)
    * **Название** - название вашего приложения. ShikiApp
    * **Redirect URI** - редирект ссылка
    * **Описание** - Описание вашего приложения
    * **Scopes** - Ничего не требуется
  1) Нажмите **OAuth приложения** **создать**
  2) Вводим данные в форму. Используйте информацию выше
  3) Нажмите **Создать**
  4) Ваше приложение создано
  5) Нажмите **Список твоих приложений OAuth** **Мои приложения**
  6) Выберите ваше приложение и нажмите на него
  7) Нажмите **Редактировать**
  8) Получите ваши **Название** (shikiApp), **Client ID** (shikiID), **Client Secret** (shikiSecret)
* imdbToken - Токен IMDB
  * Получить можно [здесь](https://www.omdbapi.com/apikey.aspx)
    * **Account Type** - тип аккаунта. Патреон платно, либо 1k запросов в день бесплатно
    * **Email** - почта
    * **Name** - Имя
    * **Use** - Назначение. Короткое описание того, зачем будет использоваться апи
  1) Введите данные в форму. Используйте информацию выше
  2) Нажмите **Submit**
  3) На указанную почту придёт токен (imdbToken)

  ## Пример .env
  ```
  DiscordToken = "..."
  DiscordID = "..."
  malID = "..."
  shikiID = "..."
  shikiSecret = "..."
  shikiApp = "..."
  imdbToken = "..."
  ```