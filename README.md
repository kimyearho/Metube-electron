# [2018-12-18] v1.3.1 UPDATE

![Imgur](https://i.imgur.com/OoTch73.png)
![Imgur](https://i.imgur.com/7WT3pmy.png)

***

![Img](https://cdn-images-1.medium.com/max/500/1*4JNvT8VJrbLKzwmfvkFFAQ.png)

### Project Information
This project is a personal project developed with the excellent Electron and Vue.JS.

### What's new ?
We are creating a simple  YouTube video player. The main purpose is a music player, but YouTube is video-based, so you can use it as a video player or you can watch all videos without advertising. Please see below for details.

### Reference
New version releases are always deployed in the repository. The new version update is fast
To keep up to date, always subscribe to the parent "watch release".
If you like the program, please click on the star! It will help developers a lot.

### Feature
"Metube" is simple and very fast. While basic search lookup is network dependent, collection management is very fast because it uses IndexedDB

### Require
Private keys are not included. Get your private key directly.
```js
# src/analiytics/analiytics.js
const analytics = new Analytics.default("[[ KEY ID HERE ]]")

# src/auth/auth.js
const CLIENT_ID = "[[ CLIENT ID HERE ]]"
const CLIENT_SECRET = "[[ CLIENT SECRET HERE ]]"

# src/renderer/plugins/pouchdb/index.js
Vue.prototype.$local = new PouchDB("[[ DB NAME HERE ]]");

# src/renderer/service/common-service.js
const API_KEY = "[[ YOUTUBE V3 API KEY ]]";
```

### Installation
```
# install
> yarn

# run
> yarn run dev

# build
> yarn run build
```

### DB related
I use PouchDB as my local database. Please refer to the PouchDB documentation for usage and related information.

### Trello (for korean)
<https://trello.com/b/qj4gO2br/metube>

### Support
I want to continue developing Metube. We welcome those who can help. <br/>
<kstory8715@gmail.com>
