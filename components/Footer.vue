
<template>

<div>

  <v-footer
    
    height="auto"
  >
    <v-card
      flat
      dark
    
      class="white--text text-xs-center footer"
    >
      <v-divider></v-divider>

      <v-card-text class="white--text pt-0">
          <v-layout row wrap>
              <v-flex xs12>
                  <v-btn class="mx-3 white--text" flat @click="showSuggest = true"><v-icon color="white">fas fa-comment-alt</v-icon>意见</v-btn>
<v-btn class="mx-3 white--text" flat @click="showWebChat = true"><v-icon color="white">fab fa-weixin</v-icon>客服</v-btn>
                  
                     

              </v-flex>
              <v-flex xs12>
        4T For Travel 是一家旅游服务平台,如果你在旅行中被坑可以来此<nuxt-link to="/">填坑爆料</nuxt-link>,为以后的游客提供帮助,让黑店、坑店曝光,为旅游事业贡献自己的一份绵薄之力,让旅游更美好,同时也可以边旅游边赚钱,可以来<nuxt-link to="/purchases">物流代购</nuxt-link>中接海淘的代购单,为您的旅行增油加力,丰富自己的旅行。
       也可以低价转让自己无法使用的商品,以减少自己的损失。如果想在旅行的途中留下纪念、准夫妻想拍摄婚纱,旅拍可以为您提供婚纱摄影、服装租赁、道具租赁、纪念视频、照片及后期处理,让旅拍为您留住人生中美好的时刻。
              </v-flex>
          </v-layout>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        渝ICP备 18009430
      &copy; 2018  <strong>4T(For Travel) 为美好旅行</strong>
      </v-card-text>
    </v-card>
  </v-footer>


                <v-dialog v-model="showSuggest" max-width="290">
      <v-card>

        <v-card-text>
          <v-text-field v-model="suggest" textarea label="请输入您宝贵的意见与建议"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="showSuggest = false">取消</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="addSuggest">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <v-dialog v-model="showWebChat" max-width="290">
        <v-card>
            <v-card-title class="green white--text">请使用微信扫一扫(请备注4T)</v-card-title>
            <v-divider></v-divider>
            <v-card-text class="text-xs-center">
                <img src="/wechat.jpg" class="wechat">
            </v-card-text>
        </v-card>
         
    </v-dialog>
</div>
</template>
<script>
export default {
  data () {
    return {
      showSuggest: false,
      suggest: '',
      showWebChat: false
    }
  },
  computed: {

  },
  methods: {
    addSuggest () {
      if (this.$store.state.token.length > 0) {
        if (this.suggest.length > 10 && this.suggest.length < 140) {
          this.$http
            .post('/suggest', this.suggest)
            .then(res => {
              if (res.data.Status) {
                this.$store.commit(
                  'SUCCESS',
                  '我们已经收到，感谢您的意见与建议🙏'
                )
                this.showSuggest = false
              }
            })
            .catch(res => {})
        } else {
          this.$store.commit('INFO', '意见在10-140个字之间哦')
        }
      } else {
        this.$store.commit('INFO', '提意见之前别忘了先登录哦')
        this.showSuggest = false

        this.$router.push({
          name: 'login',
          query: {
            redirect: this.$router.currentRoute.fullPath
          }
        })
      }
    }
  }
}
</script>
<style scoped>
.footer{width: 100%;height: auto;}
.wechat{
    max-width: 290px;
    max-height: 200px;
}
</style>
