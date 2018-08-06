<template>


    <v-toolbar clipped-left="" fixed="" translate="" app="" color="white">
      <v-layout row align-center justify-center>
        <v-flex xs2  md2>
              <router-link to="/" class="deep-orange--text">
              <label class="display-1 font-weight-bold">4T</label>
              <small class="full-logo">For Travael</small>
            </router-link>
            

        </v-flex>
        <v-flex xs7 md9>
                     
          <v-tabs :value="$store.state.headerActive"  light  color="transparent">
            <v-tabs-slider color="deep-orange"></v-tabs-slider>

            <v-tab to="/" large flat=""  @click="currentMod(0)">
              <v-icon small>fa-sun</v-icon>爆料填坑</v-tab>
            <v-tab to="/purchases" @click="currentMod(1)">
              <v-icon small >fa-shopping-cart</v-icon>物流代购</v-tab>
            <v-tab disabled>
              <v-icon small>fa-exchange-alt</v-icon>转卖</v-tab>
            <v-tab disabled>
              <v-icon small>fa-camera-retro</v-icon>旅拍</v-tab>

          </v-tabs>
        </v-flex>
        <v-flex xs3 md1>
          <div v-if="!user.id" class="nologin">
            <router-link to="/login">登陆</router-link>/
                        <router-link to="/register">注册</router-link>

            
          </div>
          <v-menu v-else offset-y class="menu">
            <v-toolbar-title slot="activator">
              <v-avatar size="40">
                <img :src="avatarRoot+ user.id+'?'+Number(new Date())" />
              </v-avatar>
            </v-toolbar-title>
            <v-list>
              <v-list-tile to="/user/profile">
                <v-icon small color="grey">settings</v-icon>
                <v-list-tile-title>设置</v-list-tile-title>
              </v-list-tile>
              <v-list-tile to="/user/articles">
                <v-icon small color="grey">wb_incandescent</v-icon>
                <v-list-tile-title>爆料</v-list-tile-title>
              </v-list-tile>

              <v-list-tile to="/user/purchases">
                <v-icon small color="grey">add_shopping_cart</v-icon>
                <v-list-tile-title>代购</v-list-tile-title>
              </v-list-tile>


              <v-list-tile to="/user/order">
                <v-icon small color="grey">list</v-icon>
                <v-list-tile-title>订单</v-list-tile-title>
              </v-list-tile>
              <v-list-tile to="/user/wallet">
                <v-icon small color="grey">fas fa-wallet</v-icon>
                <v-list-tile-title>钱包</v-list-tile-title>
              </v-list-tile>
              <!-- <v-list-tile disabled to="/logispurch">
        <v-icon small color="grey">add_shopping_cart</v-icon>
          <v-list-tile-title>转卖</v-list-tile-title>
        </v-list-tile>

        <v-list-tile  disabled to="/logispurch">
        <v-icon small color="grey">add_shopping_cart</v-icon>
          <v-list-tile-title>旅拍</v-list-tile-title>
        </v-list-tile> -->

              <v-list-tile to="/user/message">
                <v-badge>
                  <v-icon small="">mail</v-icon>
                  <span>通知</span>
                  <span v-if="newMsg>0" overlap slot="badge">{{newMsg}}</span>

                </v-badge>


              </v-list-tile>
              <v-divider></v-divider>
              <v-list-tile @click="loginOut">
                <v-icon small color="grey">cancel</v-icon>
                <v-list-tile-title>退出</v-list-tile-title>
              </v-list-tile>

            </v-list>

          </v-menu>
        </v-flex>
      </v-layout>



    </v-toolbar>





</template>
<script>
import { mapGetters, mapState } from "vuex";
import { avatarRoot } from "@/config";
export default {
  data() {
    return {
      url: avatarRoot,
      drawer: true,
      show: true,
      active: 2,
      newMsg: 0
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    loginOut() {
      this.$store.commit("LOGOUT");
      this.$router.push("/");
    },
    home() {
      this.$router.push("/");
    },
    currentMod(index) {
      this.$store.commit("ACTIVE_HEADER", index);
    }
  },
  created() {},
  mounted() {
    if (this.$store.state.token.length > 0) {
      this.$http
        .get("/user/msg/news", {})
        .then(res => {
          if (res.data.Status) {
            this.newMsg = res.data.Data;
          }
        })
        .catch(res => {
          this.$store.commit("ERROR", res.data);
        });
    }
  }
};
</script>

<style scoped>
.nologin {
  margin-right: -10px;
  float: right;
}
.logo {
  text-align: center;
  width: 130px;
  margin-top: 10px;
  margin-left: 4px !important;
}
.menu {
  /* width: 50px; */
  float: right;
}
</style>
<style>
.v-tabs__item--active {
  color: #ff7043;
}
.v-tabs__item--active i {
  color: #ff7043 !important;
}
/* .tabs__bar{
  background-color:transparent !important;
} */
</style>
