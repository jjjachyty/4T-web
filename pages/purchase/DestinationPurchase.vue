<template>
    <v-app>
<v-container grid-list-md>
            <v-layout row wrap justify-center align-center>
                <v-flex xs12 v-for="(item) in items" :key="item.id">
                   <router-link :to="'/purchase/'+item.id">
                    <v-layout row>
                <v-flex xs2 md1>
                    <v-avatar size="40">
                        <img :src="avatarRoot+item.createBy">
                      </v-avatar>
                </v-flex>
                <v-flex xs8>
                             <div class="products"><v-chip small label color="primary white--text" v-for="product in item.products">{{product.name}}</v-chip></div>
                </v-flex>
                        <v-flex xs2 class="text-xs-right" v-if="item.amount>0"><small class="red--text">预</small><span class="subheading red--text font-weight-bold">¥{{item.amount}}</span></v-flex>
                        <v-flex xs2 class="text-xs-right" v-else><small class="red--text font-weight-bold">¥{{item.amount}}</small></v-flex>
             </v-layout>
             </router-link>
             <v-divider></v-divider>
                </v-flex>
               
            </v-layout>
          
</v-container>
  
    </v-app>
</template>
<script>
export default {

  props: ['destination', 'products', 'purchase'],
  data () {
    return {
      items: [],
      index: null
    }
  },
  methods: {
    invitation (index) {
      this.index = index
      var item = this.items[index]
      this.$http.post('/user/invitation', {purchaseID: this.purchase.id, beInviter: item.createBy, destination: item.destination, inviter: this.purchase.createBy}).then(res => {
        if (res.data.Status) {
          this.items[this.index].invitation = true
        }
      })
    }
  },
  mounted () {
    this.$http.get('/destinationpurchase', {destination: this.destination, user: this.$store.state.User.user.id, id: this.purchase.id}).then(res => {
      if (res.data.Status) {
        this.items = res.data.Data
      }
    })
  }
}
</script>
<style scoped>
.products{
    width: 100%;
    /* overflow-x:auto; */
    overflow: hidden;
    /* white-space: nowrap; */
}

</style>
