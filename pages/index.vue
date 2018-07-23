<template>
<v-app>
  <v-layout row justify-center>
    <v-flex offset-md2 md9 xs12>
  <v-layout row="">
    <v-flex md5 offset-xs2 xs8>
              <v-text-field
         solo
          v-model="keywords"
         clearable
         @click:clear="search"
         prepend-inner-icon="search"
         @blur="search"
         @keyup.enter="search"
         placeholder="请输入查询关键字">
      </v-text-field> 
    </v-flex>   
   </v-layout>
    <v-layout row wrap="" v-if="serchResults">
      <v-flex xs12 md8>
        <List :articles="serchResults"></List>
      </v-flex>
      <v-flex md4>
      <Ads></Ads>
      <Top></Top>
      </v-flex>

          
      <v-btn
        color="red"
        
        dark
        fab
        fixed
        bottom
        right
        @click="toexparticle"
      >
        <v-icon>create</v-icon>
      </v-btn>
  

    </v-layout>
    </v-flex>
  </v-layout>
  </v-app>

</template>
<script>
import List from "@/pages/List";
import Ads from "@/pages/Ads";
import Top from "@/pages/Top";
export default {
  layout: "hasheader",
  components: {
    List,
    Ads,
    Top
  },
  metaInfo() {
    return {
      title: this.title,
      meta: this.meta
    };
  },
  data() {
    return {
      keywords: ""

      // title: "4T For Travael 旅游 爆料 代购 转卖 旅拍",
      // meta: [
      //   {
      //     name: "description",
      //     content:
      //       "国外[香港、澳门、日本、韩国、美国、德国、泰国、欧洲] 旅游曝光 物流代购 转卖 旅拍"
      //   }
      // ]
    };
  },
  methods: {
    search() {
      this.$nextTick(function() {
        this.$http
          .get("/serchexparticles", { keywords: this.keywords })
          .then(res => {
            if (res.data.Status) {
              this.$store.commit("GET_ARTICLES_SUCCESS", res.data.Data);
            }
          });
      });
    },
    toexparticle() {
      if (this.$store.state.token) {
        this.$router.push("exparticle");
      } else {
        this.$store.commit("INFO", "登陆后才能曝光哦");

        this.$router.replace({
          name: "login",
          query: { redirect: "/exparticle" }
        });
      }
    }
  },
  computed: {
    serchResults() {
      return this.$store.state.Article.articles;
    }
  },
  head() {
    var keyWords = new Array();
    var titles = new Array();
    var metas = new Array();
    this.$store.state.Article.articles.forEach(element => {
      keyWords.push(element.location);
      keyWords.push(element.domain);
      keyWords = keyWords.concat(element.tags);
      titles += "在" + element.location + element.domain + "被坑,";
    });
    metas.push({ name: "keyWords", content: keyWords });

    return {
      title: titles,
      meta: metas
    };
  },
  fetch(context) {
    console.log("context----------------", context);
    context.$http.get("/articles", {}).then(res => {
      if (res.data.Status) {
        context.store.commit("GET_ARTICLES_SUCCESS", res.data.Data);
      }
    });
  }
};
</script>

<style scoped>
</style>

