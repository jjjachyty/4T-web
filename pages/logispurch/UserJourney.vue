<template>
    <v-app>
        <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn slot="activator" color="primary" dark small flat outline>新增</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">我的旅程</span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md12>
                <v-autocomplete
                v-model="journey.destination"
                :items="destinations" 
                placeholder="旅游目的地"
                label="目的地"
                required
                :rules="[v => !!v || '不能为空']"
                no-data-text="没有目的地"
                item-text="name"
              item-value="name"
                clearable=""
                autocomplete> 
                  <template slot="selection" slot-scope="data">
                    <!-- <v-chip :selected="data.selected.name" :key="JSON.stringify(data.item.name)" class="chip--select-multi" @input="data.parent.selectItem(data.item)"> -->
                      <v-avatar size="30">
                <img :src="'/static/country/'+data.item.id+'.png'">
              </v-avatar>
                      {{ data.item.name }}
                    <!-- </v-chip> -->
                  </template>
                  <template slot="item" slot-scope="data">
                    <!-- <template v-if="data.item">
                      <v-list-tile-content v-html="data.item.name"></v-list-tile-content>
                    </template>  -->
                    
                    <template>
                      <v-list-tile-avatar>
                        <img :src="'/static/country/'+data.item.id+'.png'">
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                       <v-list-tile-title>
                        <v-chip label color="pink ligntn-5 white--text" small v-for="tag in data.item.tags" :key="tag">
                            {{tag}}
                        </v-chip>
                       </v-list-tile-title>
                      </v-list-tile-content>
                    </template> 
                  </template>
                 </v-autocomplete>
                 </v-flex>
              <v-flex xs12 sm6 md6>
                                 <v-dialog
        ref="startDate"
        v-model="showStartDate"
        :return-value.sync="journey.startDate"
        persistent
        lazy
        full-width
        width="290px"
      >
        <v-text-field
          slot="activator"
          required
          clearable
          v-model="journey.startDate"
          label="开始时间"
          :rules="[v => !!v || '不能为空']"
          placeholder="例:2017-08-09"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker :min="currentDate" v-model="journey.startDate" scrollable locale="zh_CN">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="showStartDate = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.startDate.save(journey.startDate)">确定</v-btn>
        </v-date-picker>
      </v-dialog>
              </v-flex>
              <v-flex xs12 sm6 md6>
                                                <v-dialog
        ref="endDate"
        v-model="showEndDate"
        :return-value.sync="journey.endDate"
        persistent
        
        lazy
        full-width
        width="290px"
      >
        <v-text-field
          slot="activator"
          required
          clearable
          v-model="journey.endDate"
          label="结束时间"
          :rules="[v => !!v || '不能为空']"
          placeholder="例:2017-08-09"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker :min="journey.startDate" v-model="journey.endDate" scrollable locale="zh_CN">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="showEndDate = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.endDate.save(journey.endDate)">确定</v-btn>
        </v-date-picker>
      </v-dialog>
              </v-flex>
              <v-flex xs12>
                       <v-select
          v-model="journey.products"
          :items="productsArray"
          label="可代购商品(可自定义)"
          placeholder="例:IPhone Ray面膜 YSL 口红"
          prepend-icon="bookmarks"
          chips
          tags
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
        </v-select>
              </v-flex>

              <!-- <v-flex xs12 sm6>
                <v-select
                  v-model="journey.chargeType"
                  :items="chargeTypes"
                  item-value="id"
                  item-text="name"
                  label="代购费类型"
                  required
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field  v-model.number="journey.chargeValue" label="代购费"></v-text-field>
              </v-flex> -->
                            <v-flex xs12>
                <v-text-field label="备注说明"  v-model="journey.remarks" textarea required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">取消</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

        <br>
        <!-- <v-content> -->
        <span v-if="journeys.length<1" class="caption grey--text">新增告诉我,打算去哪儿呢</span>
        <v-card v-else v-for="(j,index) in journeys" :key="j.id" v-bind:class="{'grey--text': '0'==j.state}">
        <br>
           <v-layout row>
               <v-flex md2 xs2>
                   <v-layout row wrap class="text-xs-center">
                       <v-flex xs12>
                            <v-avatar>
                           <img :src="'/static/country/'+ locationID(j.destination)+'.png'">
                           </v-avatar>
                       </v-flex>
                       <v-flex xs12>{{j.destination}}</v-flex>
                   </v-layout>
               </v-flex>
               <v-flex xs9 md11>
                   <v-layout row wrap>
                       <v-flex xs12 md8>
                           <span class="body-2">{{j.startDate | formatDate('YYYY-MM-DD') }}</span>至
                           <span class="body-2">{{j.endDate | formatDate('YYYY-MM-DD') }}</span>
                           <small v-if="'0'==j.state">已过期</small>
                       </v-flex>
                        <v-flex xs12 md8>
                           <v-chip small v-for="pd in j.products" label v-bind:class="{'pink':'1' == j.state,'white--text':true}" >
                               {{pd}}
                           </v-chip>
                       </v-flex>
<v-flex xs12 md8>
                        {{j.remarks}}
                       </v-flex>
                      
                   </v-layout>
               </v-flex>
           </v-layout>
           <v-divider></v-divider>
           <v-card-actions >
               <v-spacer></v-spacer>
               <v-btn color="primary" small outline @click="edit(index)">编辑</v-btn>
               <v-btn color="secondary"  small outline @click="showRemove(index)">删除</v-btn>
           </v-card-actions>
        </v-card>
        
  <v-dialog v-model="removeDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">确定删除?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="removeDialog = false">取消</v-btn>
          <v-btn color="green darken-1" flat @click.native="remove">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </v-app>
</template>
<script>
export default {

  data () {
    return {
      journeys: [],
      productsArray: ['不限', 'IPhone', 'Ray面膜', 'YSL'],
      journey: {},
      editIndex: null,
      removeDialog: false,
      valid: false,
      showStartDate: false,
      showEndDate: false,
      dialog: false,
      chargeTypes: [{id: '1', name: '实时报价'}, {id: '2', name: '总费用%'}, {id: '3', name: '一口价'}, {id: '4', name: '按重量1kg'}]
    }
  },
  methods: {
    addJourney () {
      this.$router.push('/user/journey')
    },

    edit (index) {
      this.journey = JSON.parse(JSON.stringify(this.journeys[index]))
      this.journey.startDate = this.formatDate(this.journey.startDate, 'YYYY-MM-DD')
      this.journey.endDate = this.formatDate(this.journey.endDate, 'YYYY-MM-DD')

      this.dialog = true
    },
    showRemove (index) {
      this.removeDialog = true
      this.editIndex = index
    },
    remove () {
      this.$http.delete('/user/journey', {id: this.journeys[this.editIndex].id}).then(res => {
        if (res.data.Status) {
          this.journeys.splice(this.editIndex, 1)
          this.$store.commit('SUCCESS', '删除成功')
          this.removeDialog = false
        } else {
          this.$store.commit('ERROR', res.data.Error.Err)
        }
      })
    },
    save () {
      if (this.$refs.form.validate()) {
        if (this.journey.id) {
          this.$http.put('/user/journey', this.journey).then(res => {
            if (res.data.Status) {
              this.$store.commit('SUCCESS', '保存成功')
              this.journeys[this.editIndex] = this.journey
              this.dialog = false
            }
          })
        } else { // 新增
          this.$http.post('/user/journey', this.journey).then(res => {
            if (res.data.Status) {
              this.journeys.unshift(res.data.Data)
              this.$store.commit('SUCCESS', '保存成功')
              this.dialog = false
            } else {
              this.$store.commit('ERROR', res.data.Error.Err)
            }
          })
        }
      }
    }
  },
  created () {
    this.$http.get('/user/journeys', {}).then(res => {
      if (res.data.Status) {
        this.journeys = res.data.Data
      }
    })
  }
}
</script>
<style scoped>


img {
    max-width: 95%;
    max-height: 95%;
}

</style>
