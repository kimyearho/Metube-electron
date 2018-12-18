let ytPlayer;

class YTPlayer {

  constructor() {
    this.listenToWin();
    this.startProgressChecker();
    this.playerState = null;
  }

  setState(state) {
    this.playerState = state;
    if (this.videoEnded) {
      this.send('onEnd');
      this.sendCurrentTime();
    }
    this.send('onStateChange', this.playerState);
    return false;
  }

  get videoEnded() {
    return this.playerState === YT.PlayerState.ENDED;
  }

  get isPlaying() {
    return this.playerState === YT.PlayerState.PLAYING;
  }

  pauseVideo() {
    ytPlayer.pauseVideo();
    this.waitToBuffer()
      .then(() => ytPlayer.pauseVideo())
      .catch(err => console.error(err));
  }

  playVideo() {
    ytPlayer.playVideo();
  }

  unMute() {
    ytPlayer.unMute();
  }

  seekTo(value) {
    ytPlayer.seekTo(value);
  }

  loadVideoById(param) {
    ytPlayer.loadVideoById({ videoId: param, suggestedQuality: 'tiny' });
  }

  sendCurrentTime() {
    this.send('currentTime', ytPlayer.getCurrentTime());
  }

  setVolume(value) {
    ytPlayer.setVolume(value);
  }

  logout() {
    window.location.replace('');
  }

  waitToBuffer() {
    let timeOut = 100; // 100mil * 100 tries = 10sec
    /* eslint-disable promise/avoid-new */
    return new Promise((resolve, reject) => {
      const bufferWaitInterval = setInterval(() => {
        if (this.playerState !== YT.PlayerState.BUFFERING) {
          clearInterval(bufferWaitInterval);
          resolve();
        }
        if (--timeOut < 0) { // eslint-disable-line no-plusplus
          clearInterval(bufferWaitInterval);
          reject();
        }
      }, 100);
    });
    /* eslint-enable promise/avoid-new */
  }

  startProgressChecker() {
    setInterval(() => {
      if (this.isPlaying) {
        this.sendCurrentTime();
      }
    }, 500);
  }

  // 메인에서 전달받은 이벤트
  listenToWin() {
    window.ipcRenderer.on('win2Player', (e, args) => {
      const [command, data] = args;
      this[command](data);
    });
  }

  // 메인으로 이벤트 전송
  send(command, args) {
    window.ipcRenderer.send('player2Win', [command, args]);
  }
}

const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';

const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var element = document.getElementById("ytplayer");
element.classList.add("video-frame");

window.onYouTubePlayerAPIReady = () => {
  let yt;

  ytPlayer = new YT.Player('ytplayer', {
    width: '100%',
    height: '100%',
    playerVars: {
      showinfo: 0,
      controls: 0,
      disablekb: 1,
      modestbranding: 1
    },
    events: {
      onReady() {
        yt = new YTPlayer();
        yt.send('onReady');
      },
      onStateChange(e) {
        yt.setState(e.data);
      },
    },
  });
};
