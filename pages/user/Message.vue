<template>
    <v-app>
        <v-container>
              <v-layout row wrap>
    <v-flex xs12  md7 offset-md1>
        <p><a @click="update('1')">全部标记已读</a> | <a @click="remove('2')">清空已读</a>|<a @click="remove('1')">清空所有</a></p>
<v-divider></v-divider> 
        <br>
        <v-list   subheader v-for="msg in msgs" :key="msg.id">
            <small v-if="msg.state=='0'" class="grey--text"> <v-icon small>visibility</v-icon>已读</small>
            <small v-if="msg.state=='1'" class="deep-orange--text"> <v-icon small color="deep-orange">visibility_off</v-icon>未读</small>

            <div  v-bind:class="{'black--text':msg.state == 1,'grey--text':msg.state == 0}" v-html="msg.content"></div>
            <v-list-tile-sub-title>{{msg.createAt | formatDate("YYYY-MM-DD hh:mm:ss")}}</v-list-tile-sub-title>
            <v-divider></v-divider>

        </v-list>
                     <div class="text-xs-center" >
                    <v-btn v-if="more" flat color="primary" @click="loadmore">加载更多...</v-btn>
                    <small v-else class="grey--text caption">已全部加载</small>
               </div>
    </v-flex>
        <v-flex md4>
            <Ads :textTop="200"></Ads>
        </v-flex>
  </v-layout>
        </v-container>
    </v-app>
</template>
<script>
import Ads from "@/pages/Ads";

export default {
  components: {
    Ads
  },
  data() {
    return {
      more: true,
      msgs: []
    };
  },
  methods: {
    loadmore() {
      this.getMsg({ lastID: this.msgs[this.msgs.length - 1].id });
    },
    remove(type) {
      // type1 删除所有 2删除已读
      this.$http.delete("/user/msg", { removeType: type }).then(res => {
        if (res.data.Status) {
          if (type == "1") {
            // 清空所有
            this.msgs = [];
            this.more = false;
            this.$store.commit("SUCCESS", "清空所有消息成功");
          } else {
            // 清空已读
            this.msgs.forEach((item, index) => {
              if (item.state == "0") {
                this.splice(index, 1);
              }
              this.$store.commit("SUCCESS", "清空已读成功");
            });
          }
        } else {
          this.$store.commit("ERROR", res.data.Error.Err);
        }
      });
    },
    update(updateType) {
      var updateItems = [];
      if (updateType == "2") {
        // 更新已读
        this.msgs.forEach((item, index) => {
          if (item.state == "1") {
            // 如果为未读
            updateItems.push(item.id);
            this.msgs[index].state = "0"; // 改为已读
          }
        });
      }
      this.$http
        .put("/user/msg", { updateType: updateType, messageids: updateItems })
        .then(res => {
          if (res.data.Status) {
            console.log("全部已读");
            // this.$store.commit("SUCCESS","已全部标记为已读")
          } else {
            console.log(res.data.Error.Err);
          }
        })
        .catch(res => {
          this.$store.commit("ERROR", res.data);
        });
    },
    getMsg(params) {
      this.$http
        .get("/user/msg", params)
        .then(res => {
          if (res.data.Status) {
            if (res.data.Data.length < 3) {
              this.more = false;
            }
            res.data.Data.forEach(element => {
              this.msgs.push(element);
            });
          }
        })
        .catch(res => {
          this.$store.commit("ERROR", res.data);
        });
    }
  },
  mounted() {
    // 10秒阅读时间

    setTimeout(() => {
      if (this.msgs.length > 0) {
        this.update("2");
      }
    }, 8000);
  },
  created() {
    this.getMsg();
  }
};
</script>
<style>
.msg-content {
}
</style>
