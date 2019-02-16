# [2019-02-03] v1.4.6 UPDATE
 - MacOS UPDATE

<p align="center">
  <img src="https://i.imgur.com/YdDRBqN.png" />
  <img src="https://i.imgur.com/tD9fxw4.png" />
</p>

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/500/1*4JNvT8VJrbLKzwmfvkFFAQ.png" />
</p>

### Progress history
I noticed that when you run a YouTube playlist, your apps slow down significantly. After a closer look at the app, I noticed that the design was wrong. I am currently testing with a redesign as a prototype, which is a very satisfactory result. I think that the performance compared to the previous one is improved by more than 50%. I plan to distribute it next week after testing.

### Project Information
This project is a personal project developed with the excellent Electron and Vue.JS.
We are creating a simple  YouTube video player. The main purpose is a music player, but YouTube is video-based, so you can use it as a video player or you can watch all videos without advertising. Please see below for details.

### Reference
New version releases are always deployed in the repository. The new version update is fast
To keep up to date, always subscribe to the parent "watch release".
If you like the program, please click on the star! It will help developers a lot.

### Feature
"Metube" is simple and very fast. While basic search lookup is network dependent, collection management is very fast because it uses IndexedDB

### Roadmap
1. Multiple selection when adding video
2. Copy and move videos added to my collection
3. PouchDB Backup and Restore
4. Improved YouTube playback performance
5. Typescript conversion
***

### Installation
```
# install
> yarn

# run
> yarn run dev
> (Default Player Port: 7070)

# build
> project root create 'static' folder (require)
> yarn run build
```

***

### Trello (for korean)
<https://trello.com/b/qj4gO2br/metube>

## License
GNU General Public License v3.0
