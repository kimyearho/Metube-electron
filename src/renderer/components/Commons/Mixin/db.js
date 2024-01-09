export default {
  methods: {
    /**
     * 공통 CreateIndex
     *
     * @param {*} fieldToArray - 색인필드
     */
    createIndex(fieldToArray) {
      return this.$test.createIndex({
        index: {
          fields: fieldToArray
        }
      })
    },

    /**
     * 공통 CreateIndex
     *
     * @param {*} fieldToArray - 색인필드
     */
    createLocalIndex(fieldToArray) {
      return this.$local.createIndex({
        index: {
          fields: fieldToArray
        }
      })
    },

    /**
     * 공통 CreateIndex
     *
     * @param {*} fieldToArray - 색인필드
     */
    createYtdlIndex(fieldToArray) {
      return this.$ytdl.createIndex({
        index: {
          fields: fieldToArray
        }
      })
    },

    /**
     * 공통 CreateIndex
     *
     * @param {*} fieldToArray - 색인필드
     */
    createConfigIndex(fieldToArray) {
      return this.$recommand.createIndex({
        index: {
          fields: fieldToArray
        }
      })
    },

    /**
     * 내 컬렉션 하위에 속해있는 데이터(비디오)셋을 조회
     *
     * @param {*} _id - 선택한 컬렉션의 아이디
     */
    getSubsetMusic(_id) {
      return this.createIndex(["userId", "parentId"]).then(() => {
        return this.$test.find({
          selector: {
            userId: {
              $eq: this.getUserId()
            },
            parentId: {
              $eq: _id
            }
          },
          limit: 100
        })
      })
    },

    getRemoteProfile() {
      return this.$test
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          }
        })
        .then(result => {
          return result.docs[0]
        })
    },

    /**
     * 실제 DB 레코드를 삭제 후 스토어 DB도 함께 삭제하여 동기화를 위해 사용된다.
     * 스토어 DB의 컬렉션은 내 프로필에 존재한다.
     * 
     * @param {*} payload 
     * @param {*} data 
     * @param {*} flag 
     */
    setRemoteSubsetMusicData(payload, data, flag) {

      this.$test
        .find({
          selector: {
            type: "profile",
            userId: this.getUserId()
          }
        })
        .then(result => {
          if (result) {

            let doc = result.docs[0]

            // 내 프로필 하위의 컬렉션을 조회한다. (스토어 DB)
            let collections = doc.collections

            // 실제 DB목록을 가져오므로 마지막 레코드를 DB에서 삭제하면
            // payload값이 없다.

            // 실제 DB 레코드 셋
            let myMusicData = null

            if(payload.length > 0) {
              myMusicData = {
                // 실제 DB 목록임
                list: payload,
                listCount: payload.length,
                id: payload[0].parentId // 모든 데이터에는 부모 아이디가 있으므로 1개만 선택한다.
              }
            } else {
              myMusicData = {
                // 실제 DB 목록임
                list: [],
                listCount: 0,
                id: data.myCollectionId
              }
            }

            // 스토어 DB 컬렉션에 id와 일치하는
            const findData = this.$lodash.find(collections, { id: myMusicData.id })

            // 없으면
            if (!findData) {
              // 없으면 프로필 스토어 컬렉션에 신규로 추가한다
              collections.push(myMusicData)
              // 컬렉션 추가 후 프로필을 전부 업데이트
              this.updateProfile(doc)
            } else {
              // 있으면 

              // 검색된 컬렉션 스토어 DB 갯수와, 실제 DB갯수가 다르면
              if (findData.listCount != myMusicData.listCount) {
                const findDataIndex = this.$lodash.findIndex(collections, {
                  id: myMusicData.id
                })
                if (data) {
                  findData.list = this.$lodash.reject(findData.list, {
                    videoId: data.deletedVideoId
                  })
                  findData.listCount = findData.list.length
                  collections[findDataIndex] = findData
                  this.updateProfileAndListSync(doc, myMusicData.id, flag)
                }
              }
            }
          }
        })
    },

    // 프로필 갱신
    updateProfile(doc) {
      this.$test.put(doc).then(res => {
        if (res.ok) {
          console.log("put success!")
        }
      })
    },

    // DB 스토어 갱신 후 목록 동기화
    updateProfileAndListSync(doc, parentId, ev) {
      this.$test.put(doc).then(res => {
        if (res.ok) {
          this.getRemoteProfile().then(result => {
            if (result.collections) {
              const list = result.collections
              if (list) {
                // 스토어에 저장된 재생목록을 찾는다.
                const findData = this.$lodash.find(list, {
                  id: parentId
                })

                // 찾은 목록을 랜더링한다.
                if (findData) {
                  this.playlist = findData.list
                  this.totalTracks = findData.listCount
                }

                let musicInfo = this.getMusicInfos()
                if (musicInfo) {
                  if (ev === "p") {
                    this.cover = musicInfo.thumbnails
                    this.coverTitle = musicInfo.title
                    this.channelTitle = musicInfo.channelTitle
                    this.selectedIndex = musicInfo.index
                    this.videoActive()
                  }
                }
              }
            }
          })
        }
      })
    }
  }
}
