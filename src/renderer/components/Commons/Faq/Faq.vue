<template>
  <div>
    <!-- 타이틀바 컴포넌트 -->
    <top-header />

    <el-row>
      <el-col>
        <div class="menu1_tip">
          <div>
             <md-icon>comment</md-icon>
            <span class="collections">FAQ</span>
          </div>
          <strong
            class="tr"
            style="font-size:11px;"
          >Some types of questions and answers</strong>
        </div>
      </el-col>
    </el-row>

    <el-collapse
      v-model="activeName"
      accordion
    >
      <el-collapse-item
        title="What motivated me to start `Metube`?"
        name="1"
      >
        <p>I am a full stack web developer and I like to make something. I like YouTube and love to listen to a lot of music on YouTube. It was a bit uncomfortable for me to listen to music with YouTube turned on. YouTube is a good video platform, not a music player. So I was thinking about a music player that is not inconvenient, and I am developing to this day This project will continue until the day I dislike music.</p>
      </el-collapse-item>
      <el-collapse-item
        title="Why can not I end the YouTube player?"
        name="2"
      >
        <p>The reason for using a separate YouTube player is that it is an open source policy for using the YouTube API. If you use an open API, it is your obligation to adhere to the prescribed policies.</p>
      </el-collapse-item>
      <el-collapse-item
        title="Future plans"
        name="3"
      >
        <p>I have been developing for about a year alone.
          Perhaps it is the longest running work I have done on my personal projects. We have, and will continue to, improve features and stability and performance that may be needed or more convenient to use. We are envisioning features that are still more convenient, and are expected to be developed. However, I am developing by myself and can not go fast because I work in parallel with my work life. We will continue to develop our apps as best we can.</p>
      </el-collapse-item>
      <el-collapse-item
        title="Feedback"
        name="4"
      >
        <p>i am developing and design and testing
          Therefore, the development speed is slow. If you're having trouble using the app, please post an issue to github or email us.
          Please contact me if you have a good idea or want to ask a question. (kstory8715@gmail.com)</p>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: '1'
    };
  }
}
</script>

<style scoped>
</style>