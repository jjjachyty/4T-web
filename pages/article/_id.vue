<template>
<v-app>
<v-layout row>
    <v-flex md6 offset-md3>

        <v-card v-if="article.id">
            <v-avatar class="avatar-auth" size="70" color="grey lighten-4">
                <img v-if="article.nickNamePublish" :src="'/avatar/'+article.nickName+'.png'" alt="avatar">
                <img v-else :src="url+article.createUser" alt="avatar">
            </v-avatar>

            <v-icon small color="gray darken-2">date_range</v-icon>

            <span class="text-xs-right caption">{{article.occurrenceDate | formatDate("YYYY-MM-DD")}}</span>

            <v-card-title class="title primary--text">{{article.title}}</v-card-title>
            <v-card-title>
                <v-icon color="deep-orange" small>bookmarks</v-icon>
                <v-chip v-for="tag in article.tags" :key="tag" color="deep-orange" small outline>
                    <small class="">{{tag}}</small>
                </v-chip>
            </v-card-title>
            <v-card-title>
                <v-icon small color="blue darken-2">pin_drop</v-icon>
                <span class="">{{article.location}}</span>
                <v-icon small color="red darken-2">domain</v-icon>
                <span class="">{{article.domain}}</span>
                <!-- &nbsp; <router-link class="caption" to="itsme">这是我</router-link> -->
            </v-card-title>
            <v-card-title>
                <v-icon small color="grey darken-2">receipt</v-icon>
                <small>造成损失:</small>
                <span class="caption">{{article.wastage}}</span>
            </v-card-title>
            <v-card-text>
                <div id="editor">
                    <mavon-editor :editable="false" :toolbarsFlag="false" defaultOpen="preview" :subfield="false" v-model="article.content" ref=md></mavon-editor>
                </div>

            </v-card-text>
            <v-card-actions>
                <!-- <v-icon small color="pink darken-2">pin_drop</v-icon>
          <span class="caption">重庆</span> -->
                <!-- <v-icon small color="gray darken-2">date_range</v-icon>
          <span class="caption">2018-08-08</span>  -->
                <v-spacer></v-spacer>
                <v-btn icon v-if="thumbupFlag" @click="thumbup('1')">
                    <v-icon small color="grey">thumb_up_alt</v-icon>
                </v-btn>
                <v-icon v-if="!thumbupFlag" small color="green '">thumb_up_alt</v-icon>

                {{article.thumbsUps}}
                <!-- <v-btn icon>
            <v-icon small color="grey">thumb_down_alt</v-icon>
          </v-btn>{{article.thumbsDowns}} -->
                <v-btn icon disabled>
                    <v-icon small>remove_red_eye</v-icon>
                </v-btn>{{article.views}}
                <v-btn icon samll @click="showTipOff()">
                    举报</v-btn>
                <!-- <v-btn icon>
            <v-icon small="" color="blue">share</v-icon>
          </v-btn> -->
                <!-- <v-menu bottom left>
            <v-btn slot="activator" icon light="">
              <v-icon color="blue">share</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in shares" :key="i" @click="">
                <v-list-tile-title>
                    <v-icon>fas fa-weixin</v-icon>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu> -->

            </v-card-actions>
        </v-card>
        <Ads :textTop="40"></Ads>
        <v-card>
            <v-card-title>
                <v-icon small>message</v-icon>
                评论 {{article.comments}}
            </v-card-title>
            <v-card-text>
                <v-card>
                    <v-card-text>
                        <div v-if="'' != $store.state.auth.token">

                            <v-avatar v-if="newComment.anonymous" size="50" color="grey lighten-4">
                                <img :src="'/avatar/'+$store.state.User.user.anNickName+'.png'">
                            </v-avatar>
                            <v-avatar v-else size="50" color="grey lighten-4">
                                <img :src="$store.state.User.user.avatar">
                            </v-avatar>
                            <v-switch color="primary" :label="`${newComment.anonymous?'匿名评论':'实名评论'}`" v-model="newComment.anonymous"></v-switch>
                        </div>

                        <router-link v-else :to="'/login?redirect='+$router.currentRoute.fullPath" class="caption">登陆后评论</router-link>
                        <!-- <v-text-field box multi-line label="发表评论"></v-text-field> -->
                        <v-text-field v-model="newComment.content" name="input-1" label="请输入评论" textarea></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn outline small :loading="loading" :disabled="loading" color="teal" class="white--text" @click.native="addComment('1')">
                            提交
                            <v-icon right dark>cloud_upload</v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <br>

                <!-- 最热评论列表 --><small class="red--text caption" v-if="hotcomments.length>0"><v-icon small color="red">fa-fire</v-icon>热评</small>
                <v-card v-for="(hitem,hindex) in hotcomments" v-bind:key="hitem.id+hindex">

                    <v-card-text>
                        <v-badge overlap :color="hitem.anonymous?'grey':'red'" right class="auth">

                            <v-avatar size="40">
                                <img v-if="hitem.anonymous" :src="'/avatar/'+hitem.anNickName+'.png'">
                                <img v-else :src="url+hitem.by">
                            </v-avatar>
                            <span slot="badge" class="caption" left>{{hitem.anonymous?'匿':'实'}}</span>

                        </v-badge>

                        <v-icon small color="gray darken-2">date_range</v-icon>
                        {{hitem.createAt | formatDate("YYYY-MM-DD HH:MM:SS")}}
                        <v-spacer></v-spacer>
                        <v-divider></v-divider>
                        <v-card-text class="comment-content">{{hitem.content}}</v-card-text>
                    </v-card-text>
                    <v-card-actions v-if="commentThumbup">
                        <v-spacer></v-spacer>

                        <v-btn v-if="!commentThumbup[hitem.id]" icon @click="thumbup('2',hindex)">
                            <v-icon small color="grey darken-2">thumb_up_alt</v-icon>
                        </v-btn>
                        <v-icon v-else small color="green darken-2">thumb_up_alt</v-icon>
                        {{hitem.thumbsUps}}
                        <!-- <v-btn icon>
                <v-icon small>thumb_down_alt</v-icon>
              </v-btn>20000 -->
                        <v-btn icon @click="showReply(hindex)">
                            <v-icon small>message</v-icon>
                        </v-btn>
                        <v-btn icon @click="showTipOff(hitem.id)">
                            举报</v-btn>
                    </v-card-actions>
                    <v-card-text>
                    </v-card-text>
                </v-card>

                <br/>

                <!-- 最新评论列表 --><small class="red--text" v-if="comments.length>0">最新评论</small>

                <v-card v-for="(item,index) in comments" v-bind:key="item.id">

                    <v-card-text>
                        <v-badge overlap :color="item.anonymous?'grey':'red'" right class="auth">

                            <v-avatar size="40">
                                <img v-if="item.anonymous" :src="'/avatar/'+item.anNickName+'.png'">
                                <img v-else :src="url+item.by">
                            </v-avatar>
                            <span slot="badge" class="caption" left>{{item.anonymous?'匿':'实'}}</span>

                        </v-badge>

                        <v-icon small color="gray darken-2">date_range</v-icon>
                        {{item.createAt | formatDate("YYYY-MM-DD hh:mm:ss")}}
                        <v-spacer></v-spacer>
                        <v-divider></v-divider>
                        <v-card-text class="comment-content">{{item.content}}</v-card-text>
                        <v-card v-if="item.reply.content" class="grey--text">
                            <v-card-text>
                                回复：
                                <v-avatar size="30">
                                    <img v-if="item.reply.anonymous" :src="'/avatar/'+item.reply.anNickName+'.png'">
                                    <img v-else :src="$store.state.User.imgRoot+item.reply.userID">
                                </v-avatar>

                                {{item.reply.content}}
                            </v-card-text>
                        </v-card>
                    </v-card-text>
                    <v-card-actions v-if="commentThumbup">
                        <v-spacer></v-spacer>

                        <v-btn v-if="!commentThumbup[item.id]" icon @click="thumbup('2',index)">
                            <v-icon small color="grey darken-2">thumb_up_alt</v-icon>
                        </v-btn>
                        <v-icon v-else small color="green darken-2">thumb_up_alt</v-icon>
                        {{item.thumbsUps}}
                        <!-- <v-btn icon>
                <v-icon small>thumb_down_alt</v-icon>
              </v-btn>20000 -->
                        <v-btn icon @click="showReply(index)">
                            <v-icon small>message</v-icon>
                        </v-btn>
                        <v-btn icon @click="showTipOff(item.id)">
                            举报</v-btn>
                    </v-card-actions>
                    <v-card-text>
                    </v-card-text>
                </v-card>
                <div class="text-xs-center">
                    <v-btn v-if="more" flat color="primary" @click="loadmore">加载更多...</v-btn>
                    <small v-else class="grey--text caption">已全部加载</small>
                </div>
            </v-card-text>
        </v-card>

        <v-dialog v-model="reply" v-if="reply" max-width="290">
            <v-card>
                <v-card-title>
                    <v-switch color="primary" :label="`${to.anonymous?'匿名评论':'实名评论'}`" v-model="to.anonymous"></v-switch>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="to.content" textarea label="回复内容"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click.native="reply = false">取消</v-btn>
                    <v-btn color="green darken-1" flat="flat" @click.native="addComment('2')">确认</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="tipOffFlag" max-width="300">
            <v-card>
                <v-card-text>
                    <v-radio-group v-model="tipOff.category">
                        <v-radio label="内容不实" value="1"></v-radio>

                        <v-radio label="色情低俗" value="2"></v-radio>
                        <v-radio label="欺诈违法" value="3"></v-radio>
                        <v-radio label="广告" value="4"></v-radio>
                        <v-radio label="其他" value="0"></v-radio>
                    </v-radio-group>

                    <v-text-field v-model="tipOff.content" textarea label="详细说明"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click.native="tipOffFlag = false">取消</v-btn>
                    <v-btn color="green darken-1" flat="flat" @click.native="addTipoffs">确认</v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>

    </v-flex>
</v-layout>
</v-app>
</template>

<script>
import Ads from '@/pages/Ads'
import {
  avatarRoot,
  apiRoot
} from '@/config'
export default {
  components: {
    Ads
  },
  metaInfo () {
    return {
      title: this.article.title,
      meta: this.meta
    }
  },
  data () {
    return {
      meta: [],
      more: true,
      url: avatarRoot,
      tipOffFlag: false,
      tipOff: {
        category: '1',
        content: ''
      },
      to: {},
      reply: false,
      replyIndex: 0,
      loading: false,
      thumbupFlag: true,

      commentThumbup: {},
      newComment: {
        content: '',
        anonymous: true
      },
      hotcomments: [],
      comments: [],
      thumbups: [],
      items: [{
        id: '1',
        avatar: '/batman.png',
        content: 'xasasas'
      }],
      shares: [{
        title: '微信',
        icon: 'fa-weixin'
      }]
    }
  },
  methods: {
    addComment (type) {
      var paramsData = this.newComment
      if (type == '2') {
        paramsData = this.to
      }

      if (
        paramsData.content &&
                paramsData.content.length > 10 &&
                paramsData.content.length < 140
      ) {
        paramsData.articleID = this.article.id
        paramsData.type = type
        paramsData.anNickName = this.$store.state.User.user.anNickName
        this.$http.post('/user/comment', paramsData).then(res => {
          if (res.data.Status) {
            this.comments.unshift(res.data.Data)
            if (type == '1') {
              this.article.comments++
            } else {
              this.comments[this.replyIndex].comment++
              var ref = this.comments[this.replyIndex + 1]
              this.comments[0].reply = {
                userID: ref.By,
                content: ref.content,
                anNickName: ref.anNickName,
                anonymous: ref.anonymous
              }
              this.reply = false
            }
            this.newComment = {
              anonymous: true
            }
          } else {
            this.$store.commit('ERROR', res.data.Error.Err)
          }
        })
      } else {
        this.$store.commit('INFO', '评论内容在10～140个字之间')
      }
    },
    thumbup (type, index) {
      var params = {
        type: type,
        articleID: this.article.id
      }
      if (type == '2') {
        params.commentID = this.comments[index].id
      }
      this.$http.post('/user/thumbup', params).then(res => {
        if (res.data.Status) {
          this.$store.commit('SUCCESS', '点赞成功')
          if (type == '1') {
            this.article.thumbsUps += 1
            this.thumbupFlag = false
          } else {
            console.log('index', index)
            this.comments[index].thumbsUps += 1
            this.commentThumbup[this.comments[index].id] = true
          }
        } else {
          this.$store.commit('ERROR', res.data.Error.Err)
        }
      })
    },
    showReply (index) {
      var item = this.comments[index]
      this.replyIndex = index
      if (this.$store.state.auth.token) {
        this.to = {
          replyCommentID: item.id,
          to: item.by,
          anonymous: true
        }
        this.reply = true
      } else {
        this.$store.commit('INFO', '登陆后才能回复')

        this.$router.replace({
          name: 'login',
          query: {
            redirect: this.$router.currentRoute.fullPath
          }
        })
      }
    },
    showTipOff (commentid) {
      if (this.$store.state.auth.token) {
        this.tipOffFlag = true
        this.tipOff.articleID = this.article.id
        this.tipOff.commintID = commentid
      } else {
        this.$store.commit('INFO', '登陆后才能回复')

        this.$router.replace({
          name: 'login',
          query: {
            redirect: this.$router.currentRoute.fullPath
          }
        })
      }
    },
    addTipoffs () {
      if (
        this.tipOff &&
                this.tipOff.content.length > 10 &&
                this.tipOff.content.length < 140
      ) {
        this.$http
          .post('/user/tipoffs', this.tipOff)
          .then(res => {
            if (res.data.Status) {
              this.tipOffFlag = false
              this.$store.commit(
                'SUCCESS',
                '感谢您的举报，我们会在第一时间处理'
              )
            }
          })
          .catch(res => {
            console.log('res', res)
          })
      } else {
        this.$store.commit('INFO', '举报内容在10～140个字之间')
      }
    },
    loadmore () {
      console.log(
        'this.comments[this.comments.length-1].id',
        this.comments.length - 1,
        this.comments[this.comments.length - 1].id
      )
      // 获取评论
      this.$http
        .get('/newcomments', {
          articleID: this.article.id,
          lastID: this.comments[this.comments.length - 1].id
        })
        .then(res => {
          if (res.data.Status) {
            if (res.data.Data.length < 10) {
              // 小于10个就没有加载更多按钮
              this.more = false
            }

            res.data.Data.forEach(item => {
              this.comments.push(item)
            })
          } else {
            this.$store.commit('ERROR', '获取更多最新评论失败')
          }
        })
    }
  },

  mounted () {
    var id = this.$route.params.id
    var url =
            this.$route.name == 'userarticle' ? '/user/article/' : '/article/'
    if (this.$store.state.auth.token != '') {
      // 获取我的点赞
      this.$http
        .get('/thumbups', {
          articleID: id
        })
        .then(res => {
          if (res.data.Status) {
            this.thumbups = res.data.Data
            res.data.Data.forEach(item => {
              console.log('item', item)
              if (item.type == '1') {
                this.thumbupFlag = false
              } else {
                this.commentThumbup[item.commentID] = true
              }
            })
          } else {
            this.$store.commit('ERROR', '获取点赞失败')
          }
        })
    }

    // 获取评论
    this.$http
      .get('/newcomments', {
        articleID: id
      })
      .then(res => {
        if (res.data.Status) {
          this.comments = res.data.Data
          if (res.data.Data.length < 10) {
            // 小于10个就没有加载更多按钮
            this.more = false
          }
        } else {
          this.$store.commit('ERROR', '获取最新评论失败')
        }
      })

    // 获取评论
    this.$http
      .get('/hotcomments', {
        articleID: id
      })
      .then(res => {
        if (res.data.Status) {
          this.hotcomments = res.data.Data
        } else {
          this.$store.commit('ERROR', '获取热论失败')
        }
      })
  },
  asyncData (context) {
    var id = context.params.id
    // var url = context.route.name === 'article-id' ? '/user/article/' : '/article/'
    var article = {}
    return context.$http.get('/article/' + id, {}).then(res => {
      if (res.data.Status) {
        article = res.data.Data
        context.app.head.meta.push({
          name: 'keyWords',
          content: article.location
        })
        context.app.head.meta.push({
          name: 'keyWords',
          content: article.domain
        })
        context.app.head.meta.push({
          name: 'keyWords',
          content: article.tags
        })
        context.app.head.meta.push({
          name: 'description',
          content: article.title
        })
        context.app.head.title = article.title
        return {article: article}
      } else {
        context.store.commit('ERROR', res.data.Error.Err)
        context.redirect('302', '/', {})
      }
    }).catch(res => {
      console.log('xxxxxxxxxxresresresresresxx', res)
      context.error({statusCode: 401, message: res.data})
    })
  }
}
</script>

<style scoped>
.ads {
    height: 100px;
}

.ads .ads-text {
    margin-top: 100px;
}

.avatar-auth {
    margin-left: 40%;
    margin-top: -30px;
}

#editor {
    margin: auto;
    width: 100%;
    /* height: 300px; */
}

.v-note-wrapper {
    position: relative;
    min-width: 200px;
    min-height: 300px;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-transition: all 0.3s linear 0s;
    transition: all 0.3s linear 0s;
    background: #fff;
    z-index: 1 !important;
    text-align: left;
}

</style><style>.comment-content {
    display: block;
    word-wrap: break-word;
}
</style>
