<template>
  <div class="container">
    <v-card class="error">
    <v-card-media class="text-xs-center">
        <img class="img" src="error.png" />
    </v-card-media>
    <v-divider></v-divider>
    <v-card-title class="text-xs-center"><span v-if="error.statusCode === 404">页面不存在</span>
    
    <span v-else >哦吼～发生错误,请稍后再试</span>
    
</v-card-title>
    <v-divider></v-divider>
<v-card-text>
    
</v-card-text>
    <v-card-actions>
       <v-spacer></v-spacer> <v-btn to="/" outline small color="teal">返回首页</v-btn>
    </v-card-actions>
    <div>
    </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["error"]
};
</script>
<style scoped>
.img {
  height: 200px;
  width: 20%;
  margin-left: 40%;
}
.error {
  margin-top: 20%;
}
</style>
