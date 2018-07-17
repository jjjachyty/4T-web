<template>
    <v-app>
      <div><v-btn color="primary" dark small flat outline @click="addPurchase">新增</v-btn></div>
      
        <!-- <v-content> -->
        <span v-if="purchases.length<1" class="caption grey--text">还未发布代购,点击[新增]按钮发布一个吧</span>
        <div v-else v-for="(p,index) in purchases" :key="p.id" >
        <v-card >
        <br>
        <router-link :to="/purchase/+p.id">
           <v-layout row>
               <v-flex md3 xs4>
                   <v-card-media height="120">
                       <img :src="purchaseRoot +p.products[0].images+'?'+Number(new Date())">
                   </v-card-media>
               </v-flex>
               <v-flex xs9 md11>
                   <v-layout row wrap>
                       <v-flex xs12 md8>
                           单号:<span class="body-2">{{p.id}}</span>
                       </v-flex>


                       <v-flex xs6 md2>
                          <p class="title red--text" v-if="p.amount > 0">¥{{p.amount}}</p>
                          <p class="title red--text" v-else>求报价</p>
                       </v-flex>
                        <v-flex class="caption red--text font-weight-bold" xs6 md1>
                           {{p.state | dict('purchaseState')}}
                       </v-flex>
                        <v-flex xs6>
                          <p class="caption grey--text">查看 {{p.views}}</p>
                        </v-flex>
                        <v-flex xs6>
                          <p class="caption  grey--text">报价 5</p>
                        </v-flex>
                         <v-flex >
                          <p class="caption  grey--text">发布于{{p.createAt | formatDate('YYYY-MM-DD HH:mm')}}</p>
                       </v-flex>
                   </v-layout>
               </v-flex>
           </v-layout></router-link>

           <v-card-actions >
               <v-spacer></v-spacer>
               <v-btn color="primary" small outline @click="edit(index)">编辑</v-btn>
               <v-btn color="warning" small outline @click="showRemove(index)">删除</v-btn>
           </v-card-actions>
                      <v-divider></v-divider>
        </v-card>
        <br>
        </div>
        <div class="text-xs-center">
            <a  v-if="purchases.length % 10 == 0" ><small>加载更多</small></a>
            <small v-else class="grey--text">已全部加载</small>
        </div>
        <!-- </v-content> -->
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
      purchases: [],
      index: null,
      removeDialog: false
    }
  },
  methods: {
    addPurchase () {
      this.$router.push('/user/purchase/')
    },
    showRemove (index) {
      if (this.purchases[index].state == '0') {
        this.index = index
        this.removeDialog = true
      } else {
        this.$store.commit('ERROR', '只能删除状态为[待接单]的代购单')
      }
    },
    remove () {
      this.$http.delete('/user/purchase', {id: this.purchases[this.index].id}).then(res => {
        if (res.data.Status) {
          this.purchases.splice(this.index, 1)
          this.removeDialog = false
        }
      })
    },
    edit (index) {
      console.log('this.purchases[index].id', this.purchases[index].id)
      this.$router.push('/user/purchase/' + this.purchases[index].id)
    }
  },
  created () {
    this.$http.get('/user/purchases', {}).then(res => {
      if (res.data.Status) {
        this.purchases = res.data.Data
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
