<template>
  <v-app>
    <v-container>
    <v-layout>
        <v-flex xs3 md2>
                          <v-navigation-drawer
      v-model="drawer"
      permanent
    >
      <v-list  class="" dense>
        <v-divider></v-divider>
        <v-list-tile v-for="item in items" :key="item.title" @click="">
          <v-list-tile-action>
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
        </v-flex>
                <v-flex xs12 md8 offset-xs1>

      <v-card>

        <v-btn v-if="!drawer" flat small @click="drawer = !drawer">
        <v-icon  >menu</v-icon>
        </v-btn>
        <v-avatar class="avatar-auth" size="100" color="grey lighten-4">
          <img src="/static/batman.png" alt="avatar">
        </v-avatar>
        <v-btn flat small><v-text-field type="file"></v-text-field>更换</v-btn>
        <v-card-text>
          <v-layout row wrap >
            <v-flex>
              <v-subheader>昵称:</v-subheader>
            </v-flex>
            <v-flex>
              <v-text-field v-model="user.nickName"></v-text-field>
            </v-flex>

            <v-flex>
              <v-subheader>邮箱:</v-subheader>
            </v-flex>
            <v-flex>
              <v-text-field :value="user.email"></v-text-field>
            </v-flex>

          </v-layout>
        </v-card-text>
      </v-card>
                </v-flex>

    </v-layout>



    </v-container>
  </v-app>
</template>
<script>
export default {
  data () {
    return {
      drawer: true,
      mini: true,
      items: [
        { title: '基本信息', icon: 'assignment_ind', color: 'blue' },
        { title: '实名认证', icon: 'how_to_reg', color: 'teal'},
        { title: '钱包', icon: 'fa-wallet', color: 'yellow'}
      ],
      user: {nickName: 'Janly', email: 'jjjachyty@163.com'}
    }
  }
}
</script>

<style scoped>
  .avatar-auth {
    margin-left: 40%;
    margin-top: 30px;
  }

</style>
