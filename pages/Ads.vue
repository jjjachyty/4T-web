<template>
<v-card class="card">
  <v-carousel  hide-controls hide-delimiters class="v-carousel">
    <v-carousel-item v-for="(item,i) in items" :src="item.src" :key="i">
            <small class="white--text tips"> 广告</small>

      <router-link :to="item.url">
        <tbody>
        <p class="white--text text-xs-center ads-text" >{{item.text}}</p>
        </tbody>
      </router-link>
    </v-carousel-item>
  </v-carousel>
</v-card>
</template>
<script>
export default {
  props: ["textTop", "height"],
  data() {
    return {
      items: [
        {
          src: "/login.png",
          text: "发表曝光文章 每月最多👍 🉐️ Garmin 运动手表 月月曝 月月送",
          url: "/activity/1"
        }
      ]
    };
  }
};
</script>
<style scoped>
.v-carousel {
  text-align: center;
  height: auto;
  width: 100%;
  position: relative;
  overflow: hidden;
  -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.tips {
  float: left;
}
.ads-text {
  padding-top: 20%;
  padding-bottom: 20%;
}
</style>


