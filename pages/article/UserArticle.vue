<template>

  <v-app>
    <div>
      <v-navigation-drawer clipped app fixed  width="220">
        <v-subheader>查询条件:</v-subheader>
        <div>
          <v-layout row wrap>
            <v-flex>
              <v-text-field v-model="serch.title" prepend-icon="title" label="曝光标题" clearable></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field v-model="serch.place" prepend-icon="place" label="发生地点" clearable></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field v-model="serch.domain" prepend-icon="domain" label="发生对象" clearable></v-text-field>
            </v-flex>
            <v-flex>

              <v-dialog ref="dialog1" v-model="showPicker1" :return-value.sync="serch.beginDate" persistent lazy full-width width="290px">
                <v-text-field slot="activator" v-model="serch.beginDate" label="选择发布开始时间" prepend-icon="access_time" readonly clearable></v-text-field>
                <v-date-picker :max="currentDate" v-model="serch.beginDate" scrollable locale="zh_CN">
                  <v-spacer></v-spacer>
                  <v-btn flat @click="showPicker1 = false">取消</v-btn>
                  <v-btn flat @click="$refs.dialog1.save(serch.beginDate)">确定</v-btn>
                </v-date-picker>
              </v-dialog>



            </v-flex>
            <v-flex>
              <v-dialog ref="dialog2" v-model="showPicker2" :return-value.sync="serch.endDate" persistent lazy full-width width="290px">
                <v-text-field slot="activator" v-model="serch.endDate" label="选择发布截止时间" prepend-icon="access_time" readonly clearable></v-text-field>
                <v-date-picker :max="currentDate" v-model="serch.beginDate" scrollable locale="zh_CN">
                  <v-spacer></v-spacer>
                  <v-btn flat color="" @click="showPicker2 = false">取消</v-btn>
                  <v-btn flat color="" @click="$refs.dialog2.save(serch.endDate)">确定</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
            <v-flex>
              <v-btn flat outline color="primary" block @click="serach">筛选
                <v-icon>filter_list</v-icon>
              </v-btn>
            </v-flex>

          </v-layout>
        </div>
      </v-navigation-drawer>

      <v-layout row wrap>
        <v-flex md8 offset-md3>
        <v-layout>
              <v-card>

        <v-flex offset-md7 xs12>
          <small v-if="articles.length > 0" class="grey--text">默认显示最新10条数据,如不满足,请使用左边条件筛选</small>
        </v-flex>

        <v-flex xs12 md12  v-for="(item ,index) in articles" :key="index">

          <v-card-text v-bind:class="{'article-approval':item.state == 0,'article-adopt':item.state == 1,'article-refuse':item.state == -1}">
            <v-layout row wrap="">

                <v-flex xs10 md11>
                                  <router-link :to='"/user/article/"+item.id'>

                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-icon color="" small>title</v-icon>
                      <label class="subheading ">{{ item.title }}</label>
                      <v-spacer></v-spacer>
                      <small class="grey--text caption">发布于:{{item.createAt | formatDate("YYYY-MM-DD HH:MM:DD")}}</small>

                    </v-flex>
                    <v-flex xs12>
                      <v-icon color="" small>bookmarks</v-icon>
                      <v-chip v-for="tag in item.tags" :key="tag" color="deep-orange" small outline>
                        <small class="">{{tag}}</small>
                      </v-chip>
                    </v-flex>
                    <v-flex xs12>
                      <v-layout row wrap>
                        <v-flex xs12 md4 class="caption">
                          <v-icon small color="">domain</v-icon> {{item.domain}}</v-flex>
                        <v-flex xs6 md4 class="caption">
                          <v-icon small color="">date_range</v-icon>{{item.occurrenceDate | formatDate("YYYY-MM-DD")}}</v-flex>
                        <v-flex xs6 md4 class="caption">
                          <v-icon small color="">place</v-icon> {{ item.location }}</v-flex>

                        <v-flex md3>
                          <v-icon small>thumb_up_alt</v-icon>{{item.thumbsUps}}
                        </v-flex>
                        <!-- <v-flex md3>
                  <v-icon small >thumb_down_alt</v-icon>{{item.thumbsDowns}}
              </v-flex> -->
                        <v-flex md3>
                          <v-icon small>remove_red_eye</v-icon>{{item.views}}
                        </v-flex>
                        <v-flex md3>
                          <v-icon small>speaker_notes</v-icon>{{item.comments}}
                        </v-flex>
                      </v-layout>

                    </v-flex>

                  </v-layout>
             </router-link>

                </v-flex>
                <v-flex xs1 md1>
                  <!-- <v-btn small icon flat color="green" :to='"/article/"+item.id'>
                    <v-icon>pageview</v-icon>
                </v-btn> -->
                  <v-btn small icon flat color="" @click="edit(item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn small icon flat color="warning" @click="showdialog(item.id,index)">
                    <v-icon>remove_circle</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-alert v-model="item.state == -1" type="error">{{item.auditOpinion}}</v-alert>
                </v-flex>


            </v-layout>
          <v-divider></v-divider>
          </v-card-text>
          <br/>
          <!-- <v-divider></v-divider> -->
        </v-flex>
        <v-flex offset-md5 offset-xs3 xs12>

          <small v-if="articles.length == 0" class="subheading grey--text">
            <img src="/static/nodata.png">哦吼~没有查询到数据...</small>
        </v-flex>
      </v-card>
              </v-layout>

            </v-flex>
                    </v-layout>


      <v-dialog v-model="removedialog" persistent max-width="290">
        <v-card>
          <v-card-title class="subhead ">确定删除该条曝光?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="removedialog = false">取消</v-btn>
            <v-btn color="warning darken-1" flat @click.native="remove">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-fab-transition>
        <v-btn color="red" small dark fab fixed bottom right to="exparticle">
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </div>
  </v-app>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  components: {
    mavonEditor
  },

  data () {
    return {
      currentDate: '',
      showPicker1: false,
      showPicker2: false,
      serch: {
        title: '',
        place: '',
        domain: '',
        beginDate: '',
        endDate: ''
      },
      selected: {
        id: '',
        index: ''
      },
      removedialog: false,
      drawer: false,
      selected: [1],
      e13: '',
      articles: []
    }
  },
  computed: {
    cardclass (value) {
      switch (value) {
        case 0:
          return 'article-approval'

          break
        case 1:
          return 'article-adopt'
          break
        case -1:
          return 'article-refuse'
          break
        default:
          break
      }
    }
  },

  created () {
    this.currentDate = this.getCurrentStr()
    this.$http.get('/user/myexparticle', {}).then(res => {
      console.log(res)
      this.articles = res.data.Data
    }).catch(res => {

    })
  },
  methods: {
    showdialog (id, index) {
      this.selected = {id: id, index: index}
      this.removedialog = true
    },
    remove () {
      this.removedialog = false
      this.$http.delete('/user/myexparticle', {articleid: this.selected.id}).then(res => {
        console.log('delete,res', res)
        if (res.data.Status) {
          this.$store.commit('SUCCESS', '删除文章成功')
          this.articles.splice(this.selected.index, 1)
        }
      })
    },
    serach () {
      this.$http.get('/user/myexparticle', this.serch).then(res => {
        console.log(res)
        this.articles = res.data.Data
      }).catch(res => {

      })
    },
    edit (item) {
      this.$router.push({name: 'exparticle', params: {id: item.id, edit: item}})
    }

  }
}
</script>
<style scoped>
/* .content{
    width: 100%;
    max-width: 100%;
    height: 200px;
    word-wrap:break-word
} */
    .v-note-wrapper {
  position: relative;
  width: 100%;
  max-height: 200px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-transition: all 0.3s linear 0s;
  transition: all 0.3s linear 0s;
  background: #fff;
  z-index: 3 !important;
  text-align: left;
}
.article-adopt{
    padding: 10px;
    background-image: url("/static/adopt.png");
    background-position-x: 80%;
    background-position-y: 50%
}
.article-refuse{
    padding: 10px;
    background-image: url("/static/refuse.png");
    background-position-x: 80%;
    background-position-y: 50%}
.article-approval{
    padding: 10px;
    background-image: url("/static/approval.png");
    background-position-x: 80%;
    background-position-y: 50%
}
</style>
