<template>

  <v-app>

    <v-card>
      <v-layout row wrap justify-center align-center>
        <v-flex offset-md4 offset-xs3 md12 xs12 align-center justify-center>
          <br>
          <croppa v-if="user.avatar" @image-remove="handleNewImage" :initial-image="user.avatar+'?'+Number(new Date())" class="upload-btn"
            @onDraw="onDraw" @init="onInit" :prevent-white-space="true" v-model="croppa" @file-size-exceed="onFileSizeExceed"
            placeholder="点击上传(小于1M)自定义头像" :accept="'image/*'" :file-size-limit="1024000" :height="125" :width="125">
          </croppa>

        </v-flex>

        <v-flex xs12>

          <!-- <v-btn v-if="!drawer" flat small @click="drawer = !drawer">
              <v-icon>menu</v-icon>
            </v-btn> -->



          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-layout row wrap justify-center="" align-center="">
                <v-flex xs4>
                  <v-subheader>匿名昵称:</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <!-- <v-avatar class="avatar-auth" size="100" color="grey lighten-4">
                  <img :src="apiRoot+'/static/avatar/'+user.anNickName+'.png'">
                </v-avatar>
           -->
                  <v-select :items="avatars" v-model="user.anNickName" placeholder="用于匿名发表爆料" item-text="name" required no-data-text="没有相应的昵称"
                    item-value="id" @change="selectAnonymous" chips :rules="anNickNameRules" clearable="" max-height="200"
                    autocomplete>
                    <template slot="selection" slot-scope="data">
                      <v-chip :selected="data.selected" :key="JSON.stringify(data.item)" class="chip--select-multi" @input="data.parent.selectItem(data.item)">
                        <v-avatar>
                          <img :src="'/static/avatar/'+data.item.id+'.png'">
                        </v-avatar>
                        {{ data.item.name }}
                      </v-chip>
                    </template>
                    <template slot="item" slot-scope="data">
                      <template v-if="data.item.header">
                        <v-list-tile-content v-text="data.item.header"></v-list-tile-content>
                      </template>

                      <template v-if="data.item.group">
                        <v-list-tile-avatar>
                          <img :src="'/static/avatar/'+data.item.id+'.png'">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                          <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-select>

                </v-flex>

                <v-flex xs4>
                  <v-subheader>个性昵称:</v-subheader>
                </v-flex>
                <v-flex xs8>
                  <v-text-field :rules="nameRules" placeholder="个性化昵称" required counter="7" v-model="user.nickName" maxlength="7"></v-text-field>
                </v-flex>


                <v-flex md6>
                  <v-btn flat="" outline="" color="blue" block="" dark="" @click="saveInfo">保存</v-btn>
                </v-flex>


              </v-layout>
            </v-form>
          </v-card-text>
          <v-alert :value="alert" :type="type" transition="scale-transition">
            {{message}} </v-alert>

        </v-flex>
      </v-layout>
    </v-card>

  </v-app>

</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: ['user'],
  data () {
    return {
      uploadFlag: false,
      avatars: [
        { id: '0000', header: '默认' },
        {
          id: '1000',
          name: '萝卜',
          group: '默认',
          url: '/static/avatar/default.png'
        },
        { id: '0001', header: '女' },
        {
          id: '11006',
          name: '神奇女侠',
          group: 'DC',
          url: '/static/avatar/dc5.png'
        },
        {
          id: '21001',
          name: '惊奇队长',
          group: '漫威',
          url: '/static/avatar/mv9.png'
        },
        { id: '0004', divider: true },
        { header: '男' },
        {
          id: '12001',
          name: '超人',
          group: 'DC',
          url: '/static/avatar/dc1.png'
        },
        {
          id: '12002',
          name: '蝙蝠侠',
          group: 'DC',
          url: '/static/avatar/dc2.png'
        },
        {
          id: '12003',
          name: '闪电侠',
          group: 'DC',
          url: '/static/avatar/dc3.png'
        },
        {
          id: '12004',
          name: '绿灯侠',
          group: 'DC',
          url: '/static/avatar/dc4.png'
        },
        {
          id: '22001',
          name: '美国队长',
          group: '漫威',
          url: '/static/avatar/mv1.png'
        },
        {
          id: '22002',
          name: '钢铁侠',
          group: '漫威',
          url: '/static/avatar/mv2.png'
        },
        {
          id: '22003',
          name: '雷神',
          group: '漫威',
          url: '/static/avatar/mv3.png'
        },
        {
          id: '22004',
          name: '绿巨人',
          group: '漫威',
          url: '/static/avatar/mv4.png'
        },
        {
          id: '22005',
          name: '死侍',
          group: '漫威',
          url: '/static/avatar/mv5.png'
        },
        {
          id: '22006',
          name: '蜘蛛侠',
          group: '漫威',
          url: '/static/avatar/mv6.png'
        },
        {
          id: '22007',
          name: '神奇先生',
          group: '漫威',
          url: '/static/avatar/mv7.png'
        },
        {
          id: '22008',
          name: '金刚狼',
          group: '漫威',
          url: '/static/avatar/mv8.png'
        }
      ],
      croppa: {},
      alert: false,
      type: 'error',
      message: '',
      nameRules: [
        v => !!v || '自定义昵称不能为空',
        v =>
          (v && v.length <= 7) || '只能输入7个字的自定义昵称,如：正义联盟蝙蝠侠'
      ],
      anNickNameRules: [
        v => !!v || '匿名昵称不能为空',
        v =>
          (v && v.length <= 7) || '只能输入7个字的自定义昵称,如：正义联盟蝙蝠侠'
      ]
      // user: {
      //   nickName: "Janly",
      //   email: 'jjjachyty@163.com',
      //   role: 'sqnx'
      // },
      // user:{},
    }
  },
  computed: {
    // ...mapGetters({
    //     // 映射 `this.doneCount` 为 `store.getters.doneTodosCount`
    //     user: 'checkUser'
    // })
  },
  methods: {
    ...mapActions({
      getAvatars: 'avatars',
      update: 'updateUser'
    }),
    selectAnonymous (item) {
      console.log(item, this.anonymous)
      this.user.anNickName = item
    },
    // setAvatar(val){
    //   this.user.anNickName = val.id
    // },
    saveInfo () {
      this.upload().then(() => {
        if (this.$refs.form.validate()) {
          var baseInfo = {
            anNickName: this.user.anNickName,
            nickName: this.user.nickName,
            address: this.user.address
          }
          this.$http.put('/user/info', baseInfo)
            .then(res => {
              this.$store.commit('SUCCESS', '设置用户基本信息成功')
              this.$store.commit('REFRESH_USER', baseInfo)
            })
            .catch(res => {
              this.$store.commit('ERROR', res)
            })
        }
      })
    },
    onFileSizeExceed () {
      this.$store.commit('INFO', '图片文件过大,大于1M')
    },
    onInit () {
      this.croppa.addClipPlugin(function (ctx, x, y, w, h) {
        /*
         * ctx: canvas context
         * x: start point (top-left corner) x coordination
         * y: start point (top-left corner) y coordination
         * w: croppa width
         * h: croppa height
        */
        console.log(x, y, w, h)
        ctx.beginPath()
        ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
        ctx.closePath()
      })
    },
    handleNewImage () {
      this.uploadFlag = true
    },
    onDraw: function (ctx) {
      // ctx.save()
      // ctx.globalAlpha = 0.7
      // ctx.drawImage("xxxx", 400, 400, 400, 400)
      // ctx.restore()
    },
    upload () {
      return new Promise((resolve, reject) => {
        var that = this
        if (this.croppa.hasImage()) {
          if (this.uploadFlag) {
            // 获取上传的token
            this.$http.get('/user/uptoken', { type: '1' }).then(res => {
              console.log('qntoken', res.data.Data)
              if (res.data.Status) {
                var uploadToken = res.data.Data
                var pic = this.croppa.generateDataUrl('image/png')
                this.$store
                  .dispatch('uploadImages', {
                    uploadToken: uploadToken,
                    file: pic,
                    key: this.$store.state.User.user.id
                  })
                  .then(res => {
                    resolve()
                  })
                  .catch(res => {
                    reject()
                  })
              } else {
                this.$store.commit(
                  'ERROR',
                  '获取头像上传Token失败，请稍后再试'
                )
                reject()
              }
            })
          } else {
            resolve()
          }
        } else {
          this.$store.commit('INFO', '请上传自定义头像')
          reject()
        }
      })
    }
  },
  created () {}
}
</script>
<style scoped>
.avatar-auth {
  /* margin-left: 40%; */
  /* margin-top: 30px; */
}
.croppa-container {
  background-color: lightblue;
  border: 2px solid grey;
  border-radius: 70px;
}
.upload-btn {
  float: left;
}
</style>

<style>
.croppa-container svg.icon-remove {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  -webkit-filter: drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.7));
  filter: drop-shadow(-2px 2px 2px rgba(0, 0, 0, 0.7));
  z-index: 3;
  cursor: pointer;
  border: 2px solid #fff;
}
</style>
