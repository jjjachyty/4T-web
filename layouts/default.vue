<template>
<v-app> 
    <Header></Header>
    <div class="main">
<nuxt/>
</div>
         <v-snackbar v-if="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      v-model="snackbar.show"
      top
    >
       {{snackbar.message}} 
    </v-snackbar> 
          <!-- <v-btn dark flat @click="snackbar.show = false">关闭</v-btn> -->

    <br>
           <v-footer  class="footer">
            <v-spacer></v-spacer>
            渝ICP备 18009430
      &copy; 2018 4T(For Travel)
     <a @click="showSuggest=true">意见反馈</a>
                            <v-spacer></v-spacer>

    </v-footer> 

          <v-dialog v-if="showSuggest" max-width="290">
      <v-card>

        <v-card-text>
          <v-text-field v-model="suggest.content" textarea label="请输入您宝贵的意见与建议"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="showSuggest = false">取消</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="addSuggest">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


 </v-app>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Header from "~/components/Header";
export default {
  components: {
    Header
  },
  data() {
    return {
      showSuggest: false,
      suggest: {}
    };
  },
  computed: {
    ...mapGetters({
      snackbar: "checkSnackbar"
    })
  },
  methods: {
    addSuggest() {
      if (this.$store.state.auth.token != "") {
        if (this.suggest.length > 10 && this.suggest.length > 140) {
          this.$http
            .post("/suggest", this.suggest)
            .then(res => {
              if (res.data.Status) {
                this.$store.commit(
                  "SUCCESS",
                  "我们已经收到，感谢您的意见与建议🙏"
                );
                this.showSuggest = false;
              }
            })
            .catch(res => {});
        } else {
          this.$store.commit("INFO", "意见在10-140个字之间哦");
        }
      } else {
        this.$store.commit("INFO", "提意见之前别忘了先登录哦");
        this.showSuggest = false;

        this.$router.push({
          name: "login",
          query: {
            redirect: this.$router.currentRoute.fullPath
          }
        });
      }
    }
  }
};
</script>

<style>
.main {
  margin-top: 120px;
}
.juanzen {
  height: 100px;
  width: 100px;
  margin-left: 50%;
}
.footer {
  width: 100%;
  text-align: center;
  height: 20px;
}

a {
  text-decoration: none;
  /* color: transparent; */
}

.application.theme--light {
  background-color: white;
}
@media screen and (max-width: 600px) {
  .markdown-body img {
    max-width: 100% !important;
    box-sizing: content-box;
    background-color: #fff;
  }
  /* .container{
  padding-top:24px;
} */
  .full-logo {
    display: none;
  }
}
@media screen and (min-width: 960px) and (max-width: 1264px) {
  .markdown-body img {
    max-width: 50% !important;
    box-sizing: content-box;
    background-color: #fff;
  }
  /* .container{
  padding:24px;
} */
}
@media screen and (min-width: 1264px) and (max-width: 1904px) {
  .markdown-body img {
    max-width: 50% !important;
    box-sizing: content-box;
    background-color: #fff;
  }
  /* .container{
  padding:0 10% 0 10%;
} */
}
@media screen and (min-width: 1904px) {
  .markdown-body img {
    max-width: 50% !important;
    box-sizing: content-box;
    background-color: #fff;
  }
  /* .container{
  padding:3% 20% 0 20%;
} */
}
</style>

