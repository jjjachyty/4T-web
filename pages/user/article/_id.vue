<template>
    <v-app>
     <v-navigation-drawer  clipped="" app="" >
         <v-subheader>注意事项：</v-subheader>
         <div class="caption tips">
                <ul>
                 <li>请保持平常心撰写爆料,不得出现不良言论包括但不限于人身攻击等（如“X便吃X吧”）</li>
                 <li>拒绝淫秽色情及政治、宗教内容（你懂的）</li>
                 <li>拒绝复制党,不得抄袭其他网站、他人爆料信息</li>
                 <li>拒绝捏造恶意攻击他人,内容必须如实并且真实阐述,必须提供图片/视频等证明材料</li>
                 <li>拒绝标题党,内容需证明文章标题所阐述</li>
                 <li class="red--text">为了避免引起不必要的麻烦,请选择匿名发布,并在内容中注意隐藏自己的身份信息</li>
                 <li>如果爆料行为同时违反了<a>《社区指导原则》</a>，我们将按照规定一并处理</li>
                
             </ul>
        </div>
    </v-navigation-drawer>

            <v-layout row wrap>
                <v-flex xs12 md3>
</v-flex>
                <v-flex xs12 md7>
            <v-card>

                 <v-container fluid grid-list-xs1>
                <v-card-text>
                    <v-layout row wrap >
                        <v-flex xs12>
                           <div ><v-switch color="primary"
      :label="`${article.nickNamePublish?'匿名发布(建议)':'实名发布(不建议)'}`"
      v-model="article.nickNamePublish"
    ></v-switch>
    </div>
                        <v-text-field  :error-messages="titleErrors" v-model="article.title" label="标题" prepend-icon="title" required class="title" placeholder="例：我被XX地方XX店被坑记录，提醒大家注意" maxlength="34" counter="34"></v-text-field>
        <v-combobox
          v-model="article.tags"
          :items="tagsArray"
          label="标签(可自定义)"
          placeholder="例:租车 购物 旅游 租房"
          prepend-icon="bookmarks"
          chips
          tags
          multiple
          :error-messages="tagsErrors"
        >
          <template slot="selection" slot-scope="data">
            <v-chip
              :selected="data.selected"
              :disabled="data.disabled"
              :key="JSON.stringify(data.item)"
              class="chip--select-multi"
              @input="data.parent.selectItem(data.item)"
               color="red" text-color="red"
               outline
                       

               close
            >
              <!-- <v-avatar color="white"><span class="pink--text" >{{ data.item.slice(0, 2).toUpperCase() }}</span></v-avatar> -->
              {{ data.item }}
            </v-chip>
            <!-- <v-chip label>
            <v-icon left>label</v-icon>Tags
            </v-chip> -->
          </template>
        </v-combobox>
                           <!-- <v-text-field prepend-icon="bookmarks" label="标签" placeholder="例:美国租车 网上购物 塞班岛旅游 重庆租房"></v-text-field> -->
                        </v-flex>
                        <v-flex xs12 md6>
                                 <v-dialog
        ref="dialog"
        v-model="showPicker"
        :return-value.sync="article.occurrenceDate"
        persistent
        lazy
        full-width
        width="290px"
      >
        <v-text-field
          slot="activator"
          required
          v-model="article.occurrenceDate"
          label="选择时间"
          placeholder="例:2017-08-09"
          prepend-icon="event"
          readonly
          :error-messages="occurrenceDateErrors"
        ></v-text-field>
        <v-date-picker :max="currentDate" v-model="article.occurrenceDate" scrollable locale="zh_CN">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="showPicker = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.dialog.save(article.occurrenceDate)">确定</v-btn>
        </v-date-picker>
      </v-dialog>
                              </v-flex>
                        <v-flex xs12 md6>
                    <v-text-field  prepend-icon="place" :error-messages="locationErrors"  v-model="article.location" label="发生地" required placeholder="例:美国纽约 xx平台xx店"></v-text-field>
                        </v-flex>
                        <v-flex xs6 md6>
                    <v-text-field prepend-icon="domain" :error-messages="domainErrors" v-model="article.domain" label="爆料对象(请具体以方便定位)" required placeholder="例:东大街666号汽车店/1栋3单元308张三"></v-text-field>
                        </v-flex>
                    <v-flex xs6 md6>
                    <v-text-field prepend-icon="receipt" :error-messages="wastageErrors" v-model="article.wastage" required label="造成损失" placeholder="例:损失金额5000元"></v-text-field>
                    </v-flex>
                    </v-layout>
                </v-card-text>
                                    </v-container>

            </v-card>
            <br>
            <v-card>
          <div id="editor">
            <mavon-editor @imgAdd="$imgAdd" @imgDel="$imgDel" :toolbars="toolbars" placeholder="开始爆料，建议按照：起因-》经过-》结果-》总结编写" v-model="article.content" ref="md" ></mavon-editor>
        </div>
            </v-card>
                        </v-flex>

            </v-layout>
      <v-btn
        v-model="fab"
        dark
        fab
        fixed
        color="red"
        bottom
        right
        @click="publish"
      >
        <v-icon>save</v-icon>
      </v-btn>
    </v-app>
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  sameAs,
  minLength,
  maxLength,
  phone
} from "vuelidate/lib/validators";

// import { mavonEditor } from 'mavon-editor'
//

import ObjectID from "bson-objectid";

export default {
  edit: false,
  name: "editor",
  mixins: [validationMixin],
  validations: {
    article: {
      title: { required },
      tags: { required },
      location: { required },
      occurrenceDate: { required },
      domain: { required },
      wastage: { required }
    }
  },
  computed: {
    titleErrors() {
      const errors = [];
      if (!this.$v.article.title.$dirty) return errors;
      !this.$v.article.title.required && errors.push("标题不能为空");
      return errors;
    },
    tagsErrors() {
      const errors = [];
      if (!this.$v.article.tags.$dirty) return errors;
      !this.$v.article.tags.required && errors.push("请为该文章打写标签");
      return errors;
    },
    occurrenceDateErrors() {
      const errors = [];
      if (!this.$v.article.occurrenceDate.$dirty) return errors;
      !this.$v.article.occurrenceDate.required &&
        errors.push("发生时间不能为空");
      return errors;
    },
    locationErrors() {
      const errors = [];
      if (!this.$v.article.location.$dirty) return errors;
      !this.$v.article.location.required && errors.push("发生地不能为空");
      return errors;
    },
    domainErrors() {
      const errors = [];
      if (!this.$v.article.domain.$dirty) return errors;
      !this.$v.article.domain.required && errors.push("曝光对象不能为空");
      return errors;
    },
    wastageErrors() {
      const errors = [];
      if (!this.$v.article.wastage.$dirty) return errors;
      !this.$v.article.wastage.required &&
        errors.push("请填写该事件对您造成的损失");
      return errors;
    }
  },
  components: {
    // 'mavon-editor': mavonEditor
  },
  data() {
    return {
      img_file: [],
      currentDate: "",
      showPicker: false,
      tagsArray: ["机票", "酒店", "租车", "接机", "门票", "其他"],
      fab: true,
      showTips: true,
      article: { content: "", nickNamePublish: true },
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        //   htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      }
    };
  },
  methods: {
    save(value, reader) {
      this.article.content = reader;
    },
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      //     // this.$refs.md.$refs.toolbar_left.img_file.splice(pos, 1)
      //               console.log("imgAdd----",pos,this.$refs.md.$refs.toolbar_left.img_file)

      //   // 缓存图片信息
      // //   this.img_file[pos] = $file;
      //   var key  = this.$store.state.User.user.id.substr(18,6)+ this.article.id+$file.name.split('.')[0]
      //   this.$store.dispatch("uploadImages",{type:"2",file:$file.miniurl,key:key}).then(res=>{
      //       console.log("上传图片res",this.$refs.md,$file)
      //       var url = this.$store.state.articleRoot+key+'.png'
      //              this.$refs.md.$imgUpdateByUrl(pos, url);
      //   console.log("pos----",pos,this.$refs.md.$refs.toolbar_left.img_file)

      //        this.$refs.md.$img2Url(pos, url)
      //         //this.$refs.md.$imgUpdateByFilename(pos,url)
      //   console.log("pos----",pos,this.$refs.md.$refs.toolbar_left.img_file)
      //     // this.$refs.md.$refs.toolbar_left.img_file.unshift([pos, null])

      //   })
      // 缓存图片信息
      this.img_file[pos] = $file;
    },
    $imgDel(file) {
      // this.$store.dispatch('deleteImages',{keys:this.article.id+file[0].name.split('.')[0]}).then(res=>{
      //         console.log("res----",res)
      // }).catch(res=>{
      //         console.log("catch res----",res)

      // })
      //  let reg = new RegExp(`\\!\\[${this.$refs.md.$refs.toolbar_left.img_file[pos+1][1]._name}\\]\\(${this.$refs.md.$refs.toolbar_left.img_file[pos][2]}\\)`, "g")
      //     console.log("reg----",reg)
      //    this.article.content = this.article.content.replace(reg, '');
      delete this.img_file[file[0]];
    },
    uploadimg($e) {
      var qiniuUpUrl = "http://upload-z2.qiniu.com/putb64/-1/key/";

      var upToken = "";
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      for (var _img in this.img_file) {
        formdata.append(_img, this.img_file[_img]);
      }

      this.$http.get("/user/uptoken", { type: "2" }).then(res => {
        if (res.data.Status) {
          upToken = res.data.Data;
        }
      });
      if (upToken != "") {
        // 不为空则上传
      }
      // axios({
      //     url: 'server url',
      //     method: 'post',
      //     data: formdata,
      //     headers: { 'Content-Type': 'multipart/form-data' },
      // }).then((res) => {
      //     /**
      //      * 例如：返回数据为 res = [[pos, url], [pos, url]...]
      //      * pos 为原图片标志（0）
      //      * url 为上传后图片的url地址
      //      */
      //      // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
      //     for (var img in res) {
      //         // $vm.$img2Url 详情见本页末尾
      //         $vm.$img2Url(img[0], img[1]);
      //     }
      // })
    },
    publish() {
      var $vm = this.$refs.md;
      // var data = JSON.parse(JSON.stringify(this.article))
      // data.occurrenceDate = this.string2Date(this.article.occurrenceDate)
      // this.article.occurrenceDate = "2018-06-6"

      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.article.content.length < 100) {
          this.$store.commit("INFO", "内容再多写一点儿吧,都没有100字呢");
        } else {
          var images = this.img_file;
          // 保存图片
          if (images.length > 0) {
            this.$http.get("/user/uptoken", { type: "2" }).then(res => {
              if (res.data.Status) {
                var uploadToken = res.data.Data;

                for (var index in images) {
                  var img = images[index];
                  if (img !== null) {
                    var key =
                      this.$store.state.User.user.id.substr(18, 6) +
                      this.article.id +
                      img.name.split(".")[0];
                    this.$store
                      .dispatch("uploadImages", {
                        uploadToken,
                        file: img.miniurl,
                        key: key
                      })
                      .then(res => {})
                      .catch(res => {
                        this.$store.commit(
                          "ERROR",
                          "第" + img + "张图片上传失败" + res
                        );
                      });
                  }
                }
                // 上传完成，批量更换图片
                for (var index in images) {
                  if (img !== null) {
                    var img = this.img_file[index];
                    var key =
                      this.$store.state.User.user.id.substr(18, 6) +
                      this.article.id +
                      img.name.split(".")[0];

                    var url =
                      this.$store.state.articleRoot + escape(key) + ".png";
                    this.$refs.md.$img2Url(index, url);
                  }
                }
              } else {
                this.$store.commit(
                  "ERROR",
                  "获取头像上传Token失败，请稍后再试"
                );
                reject(res.data);
              }
            });
          }

          if (this.$route.params.id) {
            // 编辑
            this.$http
              .put("/user/article/" + this.article.id, this.article)
              .then(res => {
                if (res.data.Status) {
                  this.$store.commit("SUCCESS", "更新文章成功,请等待重新审核");
                  this.$router.push("/user/articles");
                } else {
                  this.$store.commit("ERROR", res.data.Error.Err);
                }
              });
          } else {
            // 新增
            this.$http.post("/user/exparticle", this.article).then(res => {
              if (res.data.Status) {
                this.$store.commit("SUCCESS", "新增爆料成功");
                this.$router.push("/user/articles");
              } else {
                this.$store.commit("ERROR", res.data.Error.Err);
              }
            });
          }

          //       console.log("上传图片res",this.$refs.md,$file)
          //       var url = this.$store.state.articleRoot+key+'.png'
          //              this.$refs.md.$imgUpdateByUrl(pos, url);
          //   console.log("pos----",pos,this.$refs.md.$refs.toolbar_left.img_file)

          //         //this.$refs.md.$imgUpdateByFilename(pos,url)
          //   console.log("pos----",pos,this.$refs.md.$refs.toolbar_left.img_file)
          //     // this.$refs.md.$refs.toolbar_left.img_file.unshift([pos, null])
        }
      }
    }
  },
  created() {
    if (typeof this.$route.params.id === "string") {
      // 编辑
      this.$http.get("user/article/" + this.$route.params.id, {}).then(res => {
        if (res.data.Status) {
          this.article = res.data.Data;
          this.article.occurrenceDate = this.article.occurrenceDate.substr(
            0,
            10
          );
        } else {
          this.$store.commit("ERROR", "未查询到爆料文章");
        }
      });
    } else {
      // 新增文章
      this.article.id = ObjectID.generate();
    }
  }
};
</script>
<style>
#editor {
  margin: auto;
  width: auto;
  /* height: 300px; */
}
#create .speed-dial {
  position: absolute;
}

#create .btn--floating {
  position: relative;
}
.tips {
  padding-left: 30px;
}
.v-note-wrapper {
  position: relative;
  min-width: 300px;
  min-height: 300px;
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
.tags {
  padding-left: 100px;
}
</style>