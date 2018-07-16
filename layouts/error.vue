<template>
  <div class="container">
    <v-card class="error-card">
    <v-card-media class="text-xs-center">
        <img class="img" src="/error.png" />
       
    </v-card-media>
    <v-card-title class="text-xs-center">
      <div>
    <span v-if="error.statusCode === 404">页面不存在</span>
    
    <span v-else class="body-2 grey--text">哦吼～发生错误,请稍后再试</span>
    {{error}}
    </div>
</v-card-title>
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
  props: ['error']
}
</script>
<style scoped>
.img {
  height: 200px;
  width: 20%;
  margin-left: 40%;
}
.error-card {
  margin-top: 20%;
}
</style>
