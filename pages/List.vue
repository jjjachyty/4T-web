<template>

          <div>
      <small v-if="articles.length < 1" class="grey--text"><v-icon>mood</v-icon>恭喜，世界还是很美好的,暂无人曝光填坑哦～</small>
      <v-container grid-list-lg>
     <v-layout row wrap>
         <v-flex xs12 md12 v-for="item in articles" v-bind:key="item.id">
           <router-link class="router-link grey--text" :to='"/article/"+item.id'>

             <v-card raised >
                                 <v-badge overlap :color="item.nickNamePublish?'grey':'red'" right class="auth">

     <v-avatar  size="40">
       <img v-if="item.nickNamePublish" :src="'/static/avatar/'+item.nickName+'.png'">
        <img v-else :src="url+item.createBy+'?'+Number(new Date())">

      </v-avatar>
             <span v-if="item.nickNamePublish" slot="badge" class="caption" left>匿</span>

    </v-badge>
                 <v-card-title class="title">
                    <a :to='"/article/"+item.id'>{{item.title}}</a>
                     </v-card-title>




    <v-chip v-for="tag in item.tags" :key="tag" color="deep-orange" small outline>
              <small class="">{{tag}}</small>
            </v-chip><br/>
            
         <small class="caption createAt grey--text">发布于:{{item.createAt | formatDate("YYYY-MM-DD")}}</small>
            
                 <v-card-text id="content" class="content" >

<!-- <xmp theme="united" style="display:none;" v-text="item.content">
 </xmp> -->
<vue-showdown >{{ item.content | formatContent(500)}}</vue-showdown>

                  <!-- <a v-html="item.content" :to='"/article/"+item.id'></a> -->

                    <!-- <textarea class="contentSnapshot" v-model="item.content">{{item.content}}</textarea>  -->
                 </v-card-text>
                                      <v-divider></v-divider>

                              <v-card-actions class="caption">
                                      <v-layout row>
                                      <v-flex xs6 >
                    <v-icon small color="">pin_drop</v-icon>
                    
                  {{item.location}}</v-flex>
                                      <v-flex xs3 md3  offset-md4>           
               
                    <v-icon small color="">thumb_up_alt</v-icon>
                  {{item.thumbsUps}}
                  </v-flex >
                  <v-flex xs3 md3>
                  
                    <v-icon small color="">remove_red_eye</v-icon>
                  
                  {{item.views}}
                  </v-flex>
                  <v-flex xs3 md3>
                 
                    <v-icon small color="">message</v-icon>
                 {{item.comments}}
                  </v-flex>
                  </v-layout>

                </v-card-actions>
             </v-card>
             </router-link>
         </v-flex>
     </v-layout>
     </v-container>
          </div>
</template>
<script>
import { avatarRoot, apiRoot } from '@/config'
export default {
  props: ['articles'],
  // metaInfo() {
  //   return {
  //     title: this.title,
  //     meta: this.meta
  //   };
  // },

  data () {
    return {
      url: avatarRoot,
      title: null,
      meta: []
      //         articles:[
      //             // {id:'asasdasd1',createAt:'2018-06-08',author:'Janly',title:'我是如何在塞班岛被当地居民在船上被坑，提醒大家不要上当',location:'重庆',content:'NoSQL“横向扩展”部署方案的优点已经受到了业界的注意，但是同时很多人忽略的是NoSQL数据管理的简洁，不需要很复杂的操作模式构建，这一点对于数据库的提升也和扩展模型一样重要。在使用传统关系数据库时，添加数据前，需要定义操作模式。之后每一条记录的加入都需要严格的按照定义的操作模式进行，比如固定的列数和数据类型。因此，改变那些分区关系型数据库的操作模式，会非常的麻烦。如果你的数据获取和数据管理需求经常变化，那这种严格的模式限制将会成为制约表现的屏障。NoSQL（无论文档型、列式、K-V等等）都是水平扩展的，它们都不需要预先定义操作模式、所以也不需要在需求改变时改变操作模式。接下来我就将使用SequoiaDB来介绍文档型NoSQL数据库技术。',view:20,thumbsUp:200,thumbsDown:22,comments:200},
      //             // {id:'asasdasd2',createAt:'2018-06-08',author:'Janly',title:'我是如何在塞班岛被当地居民在船上被坑',location:'重庆',content:'xxxxx',view:20,thumbsUp:20000,thumbsDown:22,comments:2000},
      //             // {id:'asasdasd3',createAt:'2018-06-08',author:'Janly',title:'测试',location:'重庆',content:'xxxxx',view:20,thumbsUp:20000,thumbsDown:22,comments:2000},
      //             // {id:'asasdasd4',createAt:'2018-06-08',author:'Janly',title:'测试',location:'重庆',content:'xxxxx',view:20,thumbsUp:20000,thumbsDown:22,comments:2000},
      //             // {id:'asasdasd5',createAt:'2018-06-08',author:'Janly',title:'测试',location:'重庆',content:'xxxxx',view:20,thumbsUp:20000,thumbsDown:22,comments:2000},
      //             // {id:'asasdasd6',createAt:'2018-06-08',author:'Janly',title:'测试',location:'重庆',content:'xxxxx',view:20,thumbsUp:20000,thumbsDown:22,comments:2000},
      //             // {id:'asasdasd7',createAt:'2018-06-08',author:'Janly',title:'测试',location:'重庆',content:'xxxxx',view:20,thumbsUp:20000,thumbsDown:22,comments:2000},
      //             // {id:'asasdasd8',createAt:'2018-06-08',author:'Janly',title:'测试',location:'重庆',content:'xxxxx',view:20,thumbsUp:20000,thumbsDown:22,comments:2000}

      // ]
    }
  },
  mounted () {},

  created () {}
}
</script>
<style scoped>
.title {
  height: 70px;
}
.content {
  overflow: hidden;
  text-overflow: ellipsis;
  text-overflow: ellipsis; /* IE/Safari */
  -ms-text-overflow: ellipsis;
  -o-text-overflow: ellipsis; /* Opera */
  height: 8vh;
  font-size: 12px;
}
.articleThumb {
  height: 10px;
}
.auth {
  /* padding-left: 80%; */
  margin-right: 6%;
  float: right;
}
.contentSnapshot {
  width: 100%;
}
.createAt {
  padding-left: 2%;
}
.card {
  background-color: transparent !important;
}
a {
  color: black;
}
</style>
