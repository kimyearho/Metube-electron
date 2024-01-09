export default {
  data() {
    return {
      PK_ID: "63585eea117ff56b58ea7ea582000d6d",
      API_URL: "https://www.googleapis.com/youtube/v3",
      SEARCH_KEY: null,
      VIDEO_ITEMS_KEY: null
    }
  },
  created() {
    const keyList = this.$store.getters.getKeys
    if(keyList.length > 0) {
      const searchKey = this.$lodash.find(keyList, { query: 'search' })
      const videoItemsKey = this.$lodash.find(keyList, { query: 'videoItems' })
      this.SEARCH_KEY = searchKey.apiKey
      this.VIDEO_ITEMS_KEY = videoItemsKey.apiKey
    }
  },
  methods: {
    /**
     * Youtube 검색쿼리
     *
     * @param {*} text - 검색어
     */
    youtubeSearch(text) {
      return this.API_URL.concat("/search?")
        .concat(`part=snippet&q=${text}`)
        .concat(`&type=video,playlist,channel&maxResults=50&safeSearch=strict&key=${this.SEARCH_KEY}`)
    },

    youtubeLiveRadio(text) {
      return this.API_URL.concat("/search?")
        .concat(`part=snippet&q=${text}`)
        .concat(`&eventType=live&type=video&maxResults=50&key=${this.SEARCH_KEY}`)
    },

    /**
     * Youtube 재생목록 조회
     *
     * @param {*} text - 검색어
     */
    youtubePlaylistSearch(text) {
      return this.API_URL.concat("/search?")
        .concat(`part=snippet&q=${text}`)
        .concat(`&type=playlist&maxResults=30&safeSearch=strict&key=${this.SEARCH_KEY}`)
    },

    /**
     * Youtube 페이징 음악검색
     *
     * @param {*} text - 검색어
     * @param {*} nextToken - 페이징 토큰
     */
    youtubePagingSearch(text, nextToken) {
      return this.API_URL.concat("/search?")
        .concat(`part=snippet&q=${text}`)
        .concat(`&type=video,playlist,channel&pageToken=${nextToken}`)
        .concat(`&maxResults=50&safeSearch=strict&key=${this.SEARCH_KEY}`)
    },

    /**
     * Youtube 음악 연관검색
     *
     * @param {*} videoId - 비디오 아이디
     */
    youtubeRelatedSearch(videoId) {
      return this.API_URL.concat("/search?")
        .concat(`part=snippet&relatedToVideoId=${videoId}`)
        .concat(`&type=video&maxResults=30&key=${this.SEARCH_KEY}`)
    },

    /**
     * Youtube 페이징 음악 연관검색
     *
     * @param {*} videoId - 비디오 아이디
     */
    youtubePagingRelatedSearch(videoId, nextToken) {
      return this.API_URL.concat("/search?")
        .concat(`part=snippet&relatedToVideoId=${videoId}`)
        .concat(`&pageToken=${nextToken}`)
        .concat(`&type=video&maxResults=30&key=${this.SEARCH_KEY}`)
    },

    /**
     * Youtube 채널검색
     *
     * @param {*} channelId - 채널 아이디
     */
    youtubeChannelSearch(channelId) {
      return this.API_URL.concat("/channels?")
        .concat(`part=snippet,contentDetails&fields=items&id=${channelId}`)
        .concat(`&maxResults=30&key=${this.VIDEO_ITEMS_KEY}`)
    },

    /**
     * Youtube Playlist Item 목록
     *
     * @param {*} playlistId - 재생목록 아이디
     */
    youtubePlaylistItem(playlistId) {
      return this.API_URL.concat("/playlistItems?")
        .concat("part=snippet&playlistId=")
        .concat(playlistId)
        .concat("&maxResults=30")
        .concat("&key=")
        .concat(this.VIDEO_ITEMS_KEY)
    },

    /**
     * Youtube Playlist Item 목록
     *
     * @param {*} playlistId - 재생목록 아이디
     * @param {*} nextToken - 다음페이지 토큰
     */
    youtubePagingPlaylistItem(playlistId, nextToken) {
      return this.API_URL.concat("/playlistItems?")
        .concat(`part=snippet&playlistId=${playlistId}`)
        .concat(`&pageToken=${nextToken}`)
        .concat("&maxResults=30")
        .concat(`&key=${this.VIDEO_ITEMS_KEY}`)
    },

    /**
     * 비디오 1개의 정보조회
     *
     * @param {*} videoId - 비디오 아이디
     */
    youtubeVideoResult(videoId) {
      return this.API_URL.concat("/videos?")
        .concat(`part=snippet&id=${videoId}`)
        .concat(`&key=${this.VIDEO_ITEMS_KEY}`)
    },

    /**
     * 재생하고자 하는 영상의 총 길이
     *
     * @param {*} videoId - 비디오 아이디
     */
    youtubeVideoDuration(videoId) {
      return this.API_URL.concat("/videos?")
        .concat(
          `part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoId}`
        )
        .concat(`&key=${this.VIDEO_ITEMS_KEY}`)
    },

    /**
     * 비디오 정보 가져오기
     *
     * @param {*} videoId - 비디오 아이디
     */
    youtubePlaylistInfo(playlistId) {
      return this.API_URL.concat("/playlists?")
        .concat(`part=snippet&id=${playlistId}`)
        .concat(`&key=${this.VIDEO_ITEMS_KEY}`)
    },

    /**
     * 유튜브 재생길이를 초단위로 변환
     *
     * @param {*} n - ISO String
     */
    convertToSeconds(n) {
      let reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
      let hours = 0

      let minutes = 0

      let seconds = 0

      let totalseconds
      if (reptms.test(n)) {
        let matches = reptms.exec(n)
        if (matches[1]) hours = Number(matches[1])
        if (matches[2]) minutes = Number(matches[2])
        if (matches[3]) seconds = Number(matches[3])
        totalseconds = hours * 3600 + minutes * 60 + seconds
      }
      return totalseconds
    },

    /**
     * 초 단위를 0:00와 같은 문자포맷으로 치환
     *
     * @param {*} s - 재생시간(단위:초)
     */
    secondFormat(s) {
      var d = Number(s)
      var h = Math.floor(d / 3600)
      var m = Math.floor((d % 3600) / 60)
      var s = Math.floor((d % 3600) % 60)
      return (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
    }
  }
}
