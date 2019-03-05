const API_URL = "https://www.googleapis.com/youtube/v3"
// const API_KEY = "AIzaSyCxEq_AA-zkHKNvN0vW1l8dbWFjGRceG1w"
// const API_KEY = "AIzaSyBXQrLCFWgip6navZZfww_LhsyjbaW0vIQ"

// DEV
let API_KEY = "";

if(process.env.NODE_ENV === "development") {
  API_KEY = "AIzaSyAcNGab-jHH_79rEhgFFFy_4oS46yUMNds"
} else {
  API_KEY = "AIzaSyCxEq_AA-zkHKNvN0vW1l8dbWFjGRceG1w"
}

export const googleSearchPath = `https://suggestqueries.google.com/complete/search?ds=yt&client=youtube&q=`

/**
 * Youtube 음악검색
 *
 * @param {*} text - 검색어
 */
export function youtubeSearch(text) {
  return API_URL.concat("/search?")
    .concat(`part=snippet&q=${text}`)
    .concat(`&type=video,playlist,channel&maxResults=40&safeSearch=strict&key=${API_KEY}`)
}

/**
 * Youtube 음악검색
 *
 * @param {*} text - 검색어
 */
export function youtubePlaylistSearch(text) {
  return API_URL.concat("/search?")
    .concat(`part=snippet&q=${text}`)
    .concat(`&type=playlist&maxResults=30&safeSearch=strict&key=${API_KEY}`)
}

/**
 * Youtube 페이징 음악검색
 *
 * @param {*} text - 검색어
 * @param {*} nextToken - 페이징 토큰
 */
export function youtubePagingSearch(text, nextToken) {
  return API_URL.concat("/search?")
    .concat(`part=snippet&q=${text}`)
    .concat(`&type=video,playlist,channel&pageToken=${nextToken}`)
    .concat(`&maxResults=40&safeSearch=strict&key=${API_KEY}`)
}

/**
 * Youtube 음악 연관검색
 *
 * @param {*} videoId - 비디오 아이디
 */
export function youtubeRelatedSearch(videoId) {
  return API_URL.concat("/search?")
    .concat(`part=snippet&relatedToVideoId=${videoId}`)
    .concat(`&type=video&maxResults=30&key=${API_KEY}`)
}

/**
 * Youtube 페이징 음악 연관검색
 *
 * @param {*} videoId - 비디오 아이디
 */
export function youtubePagingRelatedSearch(videoId, nextToken) {
  return API_URL.concat("/search?")
    .concat(`part=snippet&relatedToVideoId=${videoId}`)
    .concat(`&pageToken=${nextToken}`)
    .concat(`&type=video&maxResults=30&key=${API_KEY}`)
}

/**
 * Youtube 채널검색
 *
 * @param {*} channelId - 채널 아이디
 */
export function youtubeChannelSearch(channelId) {
  return API_URL.concat("/channels?")
    .concat(`part=snippet,contentDetails&fields=items&id=${channelId}`)
    .concat(`&maxResults=30&key=${API_KEY}`)
}

/**
 * Youtube Playlist Item 목록
 *
 * @param {*} playlistId - 재생목록 아이디
 */
export function youtubePlaylistItem(playlistId) {
  return API_URL.concat("/playlistItems?")
    .concat("part=snippet&playlistId=")
    .concat(playlistId)
    .concat("&maxResults=30")
    .concat("&key=")
    .concat(API_KEY)
}

/**
 * Youtube Playlist Item 목록
 *
 * @param {*} playlistId - 재생목록 아이디
 * @param {*} nextToken - 다음페이지 토큰
 */
export function youtubePagingPlaylistItem(playlistId, nextToken) {
  return API_URL.concat("/playlistItems?")
    .concat(`part=snippet&playlistId=${playlistId}`)
    .concat(`&pageToken=${nextToken}`)
    .concat("&maxResults=30")
    .concat(`&key=${API_KEY}`)
}

/**
 * 비디오 1개의 정보조회
 *
 * @param {*} videoId - 비디오 아이디
 */
export function youtubeVideoResult(videoId) {
  return API_URL.concat("/videos?")
    .concat(`part=snippet&id=${videoId}`)
    .concat(`&key=${API_KEY}`)
}

/**
 * 재생하고자 하는 영상의 총 길이
 *
 * @param {*} videoId - 비디오 아이디
 */
export function youtubeVideoDuration(videoId) {
  return API_URL.concat("/videos?")
    .concat(`part=contentDetails,snippet&fields=items(id,contentDetails(duration))&id=${videoId}`)
    .concat(`&key=${API_KEY}`)
}

/**
 * 비디오 정보 가져오기
 *
 * @param {*} videoId - 비디오 아이디
 */
export function youtubePlaylistInfo(playlistId) {
  return API_URL.concat("/playlists?")
    .concat(`part=snippet&id=${playlistId}`)
    .concat(`&key=${API_KEY}`)
}

/**
 * 유튜브 재생길이를 초단위로 변환
 *
 * @param {*} n - ISO String
 */
export function convertToSeconds(n) {
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
}

/**
 * 초 단위를 0:00와 같은 문자포맷으로 치환
 *
 * @param {*} sec_num - 재생시간(단위:초)
 */
export function secondFormat(sec_num) {
  var d = Number(sec_num)
  var h = Math.floor(d / 3600)
  var m = Math.floor((d % 3600) / 60)
  var s = Math.floor((d % 3600) % 60)
  return (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s
}
