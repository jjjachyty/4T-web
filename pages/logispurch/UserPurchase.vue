<template>
    <v-app>
        <v-form v-model="valid" lazy-validation ref="form">
            <v-layout row>
                    <v-flex  md6 offset-md2>
                        <v-layout row wrap>
                    
                      <v-flex xs12 md6>
                <v-autocomplete
                v-model="purchaseData.destination"
                :items="destinations" 
                placeholder="指定代购地"
                label="代购地"
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

                          <v-flex xs12 md6>


 <v-autocomplete
              v-model="purchaseData.address"
              :items="address"
              color="blue-grey lighten-2"
              label="收货地址"
                    :rules="[v => !!v || '不能为空']"

              
            >
              <template
                slot="selection"
                slot-scope="data"
              >
                <!-- <v-chip
                  :selected="data.selected"
                  close
                  class="chip--select-multi"
                  @input="data.parent.selectItem(data.item)"
                > -->
                  
                 {{data.item.province}}{{data.item.city}}{{data.item.county}}
                <!-- </v-chip> -->
              </template>
              <template
                slot="item"
                slot-scope="data"
              >
                
                <template>
                  <v-list-tile-content>
                      <v-layout align-center justify-center>
                          <v-flex class="caption grey--text" xs2 md1 v-if="data.item.id == defaultAddress">默认</v-flex>
                          <v-flex>
                              <v-layout>
                                  <v-flex>
                                       <v-list-tile-title>{{data.item.userName}}{{data.item.phone}}</v-list-tile-title>
                    <v-list-tile-sub-title>{{data.item.province}}{{data.item.city}}{{data.item.county}}</v-list-tile-sub-title>
                                  </v-flex>
                              </v-layout>
                          </v-flex>
                      </v-layout>                   
                  </v-list-tile-content>
                </template>
              </template>
            </v-autocomplete>



    </v-flex>

                <v-flex xs12 md12>
                    <v-text-field  v-model="purchaseData.content" textarea label="描述说明" :rules="[v => !!v || '不能为空']" placeholder="特别说明"></v-text-field>
                </v-flex>
                <v-flex xs12 md12>
                    <v-card>
                            <v-toolbar height="40">
                            商品清单 <span class="title red--text" v-if="amount > 0">¥{{amount}}</span><v-spacer></v-spacer> <v-btn small icon @click="addProduct"><v-icon small>add</v-icon>新增</v-btn>
                            </v-toolbar>
                        <v-card v-for="(pd,index) in purchaseData.products" :key="pd.id">
                            <v-layout row wrap align-center justify-end>
                                <v-flex  xs12  md3 class="text-xs-center">
                                <croppa initial-size="contain" :prevent-white-space="true" v-model="productsImages[index]" @image-remove="handleRemoveImage(pd)" :initial-image="purchaseRoot+pd.images+'?'+Number(new Date())" :accept="'image/*'"    :file-size-limit="1024000"  placeholder="上传商品图片">
                                </croppa>
                                </v-flex>
                                <v-flex xs12 md9>
                                    <v-layout row wrap>
                                        <v-flex xs6 md3>
                                            <v-text-field  v-model="pd.name" :rules="[v => !!v || '不能为空']" label="名称" placeholder="商品名称"></v-text-field>
                                        </v-flex>

                                        <v-flex xs6 md3>
                                            <v-text-field  v-model.number="pd.quantity"  :rules="[v => !!v || '不能为空']" label="数量"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6 md3>
                                            <v-text-field  label="参考单价" v-model.number="pd.price" placeholder="知道价格可填"></v-text-field>
                                        </v-flex>
                                        <v-flex xs6 md3>
                                            <v-text-field  label="参考渠道" v-model="pd.shopName" placeholder="意向购买渠道"></v-text-field>
                                        </v-flex>
                                        <v-flex xs12>
                                            <v-text-field textarea label="说明" v-model="pd.describe" :rules="[v => !!v || '不能为空']" placeholder="货号/型号/颜色等说明"></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-card>

                    </v-card>
                </v-flex>
                <v-flex xs12 class="text-xs-center" v-if="purchaseData.products.length>0">
                    <v-btn small outline color="primary" @click="save">保存</v-btn>
                </v-flex>
                        </v-layout>
                    </v-flex>
            </v-layout>
           
           </v-form>
  
    </v-app>
</template>
<script>
import ObjectID from 'bson-objectid'
export default {

  data () {
    return {
      valid: false,
      productsImages: [],
      valid: false,
      address: [],
      destination: null,
      defaultAddress: '',
      purchaseData: {address: null, destination: '', products: []}

    }
  },
  computed: {
    amount: function () {
      var amount = 0.0
      for (const key in this.purchaseData.products) {
        if (this.purchaseData.products.hasOwnProperty(key)) {
          amount += Number(this.purchaseData.products[key].price * this.purchaseData.products[key].quantity)
        }
      }

      return amount
    }},
  methods: {
    handleRemoveImage (pd) {
      pd.images = ''
    },
    addProduct () {
      this.purchaseData.products.push({id: ObjectID(), name: '', quantity: 0, price: 0, images: '', shopName: '', describe: ''})
    },
    save () {
      if (this.$refs.form.validate()) {
        this.handerProductImgs().then(res => {
          this.purchaseData.amount = this.amount
          // this.purchaseData.targetLocation = this.targetLocation.name
          if (this.$route.params.id) { // 编辑
            this.$http.putJson('/user/purchase', this.purchaseData).then(res => {
              if (res.data.Status) {
                this.$store.commit('SUCCESS', '更新成功')
                this.$router.push('/user/purchases')
              } else {
                this.$store.commit('ERROR', res.data.Error.Err)
              }
            })
          } else { // 新增
            this.$http.postJson('/user/purchase', this.purchaseData).then(res => {
              if (res.data.Status) {
                this.$store.commit('SUCCESS', '保存成功')
                this.$router.push('/user/purchases')
              } else {
                this.$store.commit('ERROR', res.data.Error.Err)
              }
            })
          }
        })
      }
    },
    handerProductImgs () {
      // 获取上传的token
      return new Promise((resolve, reject) => {
        this.$http.get('/user/uptoken', {type: '3'}).then(res => {
          if (res.data.Status) {
            var uploadToken = res.data.Data
            var updateCount = 0
            var successCount = 0
            for (var index in this.purchaseData.products) {
              var pd = this.purchaseData.products[index]
              var pdImages = this.productsImages[index]
              if (pdImages.imageSet) {
                updateCount++
                if (pd.images == '') { // 需要上传
                  var pic = pdImages.generateDataUrl('image/png')
                  var key = pd.id + '_' + this.$store.state.User.user.id + '_' + index
                  this.$store.dispatch('uploadImages', {uploadToken: uploadToken, file: pic, key: key}).then(res => {
                    this.purchaseData.products[successCount].images = key
                    successCount++
                    if (updateCount == successCount) {
                      resolve(true)
                    }
                  }).catch(res => {
                    this.$store.commit('ERROR', '第' + Number(index + 1) + '个商品图片上传失败')
                    reject(false)
                  })
                } else {
                  successCount++
                  if (updateCount == successCount) {
                    resolve(true)
                  }
                }
              } else {
                this.$store.commit('ERROR', '第' + Number(index + 1) + '个商品未上传图片')
                return reject(false)
              }
            }
          } else {
            this.$store.commit('ERROR', '获取头像上传Token失败，请稍后再试')
            return reject(false)
          }
        })
      })
    }
  },
  created () {
    this.$http.get('/user/address', {}).then(res => {
      if (res.data.Status) {
        this.address = res.data.Data.address
        this.defaultAddress = res.data.Data.defaultAddress
      }
    })

    if (this.$route.params.id) { // 编辑
      this.$http.get('/purchase', {id: this.$route.params.id}).then(res => {
        if (res.data.Status) {
          this.purchaseData = res.data.Data
        }
      })
    } else { // 新增

    }
  }
}
</script>

<style scoped>

/* img {
    max-width: 90%;
    max-height: 90%;
} */
canvas{
    max-width:100%
}
</style>
