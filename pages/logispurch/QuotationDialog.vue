<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">报价单</span>
          <v-spacer></v-spacer>
          <span class="red--text title">¥{{orderAmount}}</span>
          <!-- <span>
            <span class="red--text header">报¥{{orderAmount}}</span>
            <br>
            <span class="teal--text caption">预¥{{purchase.amount}}</span>
          </span>
          <span class="red--text caption">赚¥{{orderAmount-purchase.amount}}</span> -->
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-card v-if="quotationOrder" v-for="(product,index) in quotationOrder.products" :key="product.id">
            <v-layout row wrap align-center>
              <v-flex xs1 md1>
                <span class="title red--text">{{index+1}}.</span>
              </v-flex>
              <v-flex md1>
                名称:
              </v-flex>
              <v-flex xs5 md4>
                <span class="grey--text caption">{{product.name}}</span>
              </v-flex>
              <v-flex xs2 md1>
                数量:
              </v-flex>
                            <v-flex xs2 md5>
                <span class="grey--text caption">{{product.quantity}}</span>
              </v-flex>

              <v-flex xs12 md12>
                <v-layout align-center justify-center row >
                  <v-flex xs4 md2>
                    <croppa v-model="productsImages[index]" @new-image-drawn="handleNewImage(product)" :initial-image="purchaseRoot+product.images+'?'+Number(new Date())" :accept="'image/*'"  :width="100" :height="80" :file-size-limit="1024000"  placeholder="上传商品图片">
                    </croppa>
                  </v-flex>
                  <v-flex xs8 md8>
                    <v-layout>
                      <v-flex>
                        <v-flex xs12 md12 offset-xs1>
                          <v-text-field placeholder="购买店名称" prepend-icon="shop" label="渠道" v-model="product.shopName" clearable></v-text-field>
                        </v-flex>
                        <!-- <v-flex xs2 md1 offset-xs1>报价:</v-flex> -->
                        <v-flex xs12 md12 offset-xs1>
                          <v-text-field prefix="¥" label="价格" :rules="priceRules" required prepend-icon="money" placeholder="商品实际价格" v-model.number="quotationOrder.products[index].price"
                            clearable></v-text-field>
                        </v-flex>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>

              </v-flex>

              <!-- <v-flex xs2 md1 offset-xs1>渠道:</v-flex> -->

            </v-layout>
            <v-divider></v-divider>
          </v-card>
          <br>
          <v-layout>
            <v-flex xs12>
              <v-card>
                <v-layout row wrap align-center>
                  <v-flex xs12>
                    <v-text-field min="0" required prepend-icon="money" v-model.number="quotationOrder.charge" :rules="chargeRules" type="number"
                      label="代购费(包邮):" clearable placeholder="包邮代购费"></v-text-field>
                  </v-flex>
                  <v-flex>
                    <v-dialog ref="timeDialog" v-model="timeDialog" :return-value.sync="quotationOrder.expiryTime" persistent lazy full-width
                      width="290px">

                      <v-text-field slot="activator" clearable required v-model="quotationOrder.expiryTime" :rules="expiryTimeRules" placeholder="报价截止时间"
                        label="报价截止时间" prepend-icon="access_time" readonly></v-text-field>
                      <v-time-picker v-model="quotationOrder.expiryTime" actions format="24hr" :min="minExpiryTime" locale="zh_CN">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="timeDialog = false">取消</v-btn>
                        <v-btn flat color="primary" @click="$refs.timeDialog.save(quotationOrder.expiryTime)">确定</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex>
                    <v-dialog ref="deliveryTimeDialog" v-model="deliveryTimeDialog" :return-value.sync="quotationOrder.deliveryTime" persistent
                      lazy full-width width="290px">

                      <v-text-field slot="activator" v-model="quotationOrder.deliveryTime" placeholder="国内发货时间" required clearable :rules="deliveryTimeRules"
                        label="国内发货时间" prepend-icon="date" readonly></v-text-field>

                      <v-date-picker v-model="quotationOrder.deliveryTime" actions :min="new Date()| formatDate('YYYY-MM-DD')" locale="zh_CN">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="deliveryTimeDialog = false">取消</v-btn>
                        <v-btn flat color="primary" @click="$refs.deliveryTimeDialog.save(quotationOrder.deliveryTime)">确定</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>

                </v-layout>
              </v-card>
            </v-flex>

          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click.native="close">取消</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" flat @click.native="saveQuotation">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
import { validationMixin } from 'vuelidate'
export default {
  props: ['quotationOrder', 'dialog', 'purchase', 'index'],

  computed: {
    orderAmount: function () {
      var amount = 0.0
      for (const key in this.quotationOrder.products) {
        if (this.quotationOrder.products.hasOwnProperty(key)) {
          amount += Number(this.quotationOrder.products[key].price) * this.quotationOrder.products[key].quantity
        }
      }

      return Number(this.quotationOrder.charge) + Number(amount)
    },
    minExpiryTime: function () {
      return this.formatDate(new Date(new Date().getTime() + 10 * 60 * 1000), 'HH:mm')
    }

  },
  data () {
    return {
      valid: false,
      productsImages: [],
      priceRules: [
        v => !!v || '商品也是有价格的哦'
      ],
      expiryTimeRules: [
        v => !!v || '最迟什么时候回复你呢？'
      ],
      deliveryTimeRules: [
        v => !!v || '什么时候发货呢？'
      ],
      chargeRules: [
        v => !!v || '好歹赚点儿辛苦费吧'
      ],
      timeDialog: false,
      deliveryTimeDialog: false,
      min: '2018-07-02'
    }
  },
  methods: {
    close () {
      console.log('closeDialog')
      this.$emit('closeDialog')
    },
    handleNewImage (product) {
      product.images = ''
    },
    handerProductImgs () {
      // 获取上传的token
      return new Promise((resolve, reject) => {
        this.$http.get('/user/uptoken', {type: '3'}).then(res => {
          if (res.data.Status) {
            var uploadToken = res.data.Data
            var updateCount = 0
            var successCount = 0
            for (var index in this.quotationOrder.products) {
              var pd = this.quotationOrder.products[index]
              var pdImages = this.productsImages[index]
              if (pdImages.imageSet) {
                updateCount++
                if (pd.images == '') { // 需要上传
                  var pic = pdImages.generateDataUrl('image/png')
                  var key = pd.id + '_' + this.$store.state.User.user.id + '_' + index
                  this.$store.dispatch('uploadImages', {uploadToken: uploadToken, file: pic, key: key}).then(res => {
                    this.quotationOrder.products[successCount].images = key
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
    },
    async saveQuotation () {
      if (this.$refs.form.validate()) {
        this.handerProductImgs().then(flag => {
          if (!this.index) { // 新增
            this.quotationOrder.purchaseID = this.purchase.id
            this.$http.postJson('/user/quotation', this.quotationOrder).then(res => {
              if (res.data.Status) {
                console.log('保存报价单', res.data)
                this.close()
                this.$emit('updateOrders', res.data.Data)
              } else {
                this.$store.commit('ERROR', res.data.Error.Err)
              }
            }).catch(res => {

            })
          } else { // 编辑
            this.quotationOrder.purchaseID = this.purchase.id
            this.$http.putJson('/user/quotation', this.quotationOrder).then(res => {
              if (res.data.Status) {
                console.log('修改报价单', res.data)

                this.close()
                this.$emit('updateOrders', this.quotationOrder)
              } else {
                this.$store.commit('ERROR', res.data.Error.Err)
              }
            }).catch(res => {

            })
          }
        }).catch(res => {
          this.$store.commit('ERROR', 'sasasasasasas-----', res)
        })
      }
    }
  },
  create () {
    this.productsImages = new Array(this.quotationOrder.products.length)
  }
}
</script>
