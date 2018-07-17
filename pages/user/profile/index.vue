<template>
  <v-app>


    <div class="container"> 
    

      <v-navigation-drawer clipped  app fixed  v-model="drawer" width="170">
      <v-list>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" @click="active=item.id">
          <v-list-tile-action>
            <v-icon small :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
        <v-layout row wrap>
         
          <v-flex offset-md1 md6 xs12>
          <div v-if="active == '1'">
            <UserInfo v-bind:user="user"></UserInfo>

          </div>
          <div v-if="active == '2' ">
            <Certification v-bind:idCardF="user.idCard || {}" v-bind:idCardB="user.idCard || {}" v-bind:certified="user.idCardValid || false"></Certification>
          </div>
          <div v-if="active == '3'">
            <Guarantee></Guarantee>
          </div>
          <div v-if="active == '4'">
            <ModifyPasswd></ModifyPasswd>
          </div>  
                    <div v-if="active == '5'">
            <Address v-bind:user="user"></Address>
          </div>         
          </v-flex>
          <v-flex offset-md1 md4 xs12>
          <Ads :textTop="200"></Ads>
          </v-flex>
        </v-layout>
    </div>

  </v-app>
</template>

<script>
import Ads from '~/pages/Ads'
import Certification from './Certification'
import UserInfo from './UserInfo'
import Guarantee from './Guarantee'
import ModifyPasswd from './ModifyPasswd'
import Address from './Address'

import { mapGetters, mapActions} from 'vuex'

export default {
  components: {
    Ads,
    ModifyPasswd,
    Certification,
    UserInfo,
    Guarantee,
    Address
  },
  data: () => ({
    user: {avatar: ''},
    active: 1,
    items: [{
      title: '基本信息',
      id: 1,
      icon: 'assignment_ind',
      color: 'primary'
    },
    {
      title: '实名认证',
      id: 2,
      icon: 'how_to_reg',
      color: 'primary'
    },
      // {
      //   title: '担保',
      //   id: 3,
      //   icon: 'fa-wallet',
      //   color: 'primary'
      // },
    {
      title: '修改密码',
      id: 4,
      icon: 'password',
      color: 'primary'
    },
    {
      title: '收货地址',
      id: 5,
      icon: 'add',
      color: 'pin_drop'
    }
    ]

  }),
  computed: {
    pc: {
    // getter
      get: function () {
        if (window.innerWidth > 960) {
          return true
        } else {
          false
        }
      },
      // setter
      set: function (newValue) {

      }
    }
  },
  methods: {
  },
  mounted () {
    this.$http.get('/user/info', {type: ''}).then(res => {
      if (res.data.Status) {
        this.user = res.data.Data
      } else {
        this.$store.commit('ERROR', res.data.Error.Err)
      }
    })
    this.active = this.$route.params.active || 1
    this.drawer = true
  }
}
</script>


