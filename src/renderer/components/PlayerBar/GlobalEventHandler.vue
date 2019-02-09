<template>
  <div></div>
</template>

<script>
import StoreMix from "@/components/Mixin/index";
import DataMix from "@/components/Mixin/db";
import GlobalMix from "@/components/Mixin/common";
export default {
  name: "GlobalEventHandler",
  mixins: [StoreMix, GlobalMix, DataMix],
  created() {
    const routerName = this.$route.name;
    this.$ipcRenderer.on("player2Win", (e, data) => {
      let event_key = data[0];
      let event_value = data[1];
      if (event_key == "onReady") {
      } else if (event_key == "onStateChange") {
        this.playerState(event_value);
      } else if (event_key == "currentTime") {
        this.$emit("playVideoSecond", event_value);
      }
    });
  },
  mounted() {},
  methods: {}
};
</script>

<style scoped>
</style>