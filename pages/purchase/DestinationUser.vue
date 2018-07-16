<template>
    <v-app>
<v-container grid-list-md>
            <v-layout row wrap justify-center align-center>
                <v-flex xs12 v-for="(item,index) in items">
                    <v-layout row>
                <v-flex xs2 md1>
                    <v-avatar size="40">
                        <img :src="avatarRoot+item.createBy">
                      </v-avatar>
                </v-flex>
                <v-flex xs7 md9>
                    <v-layout row wrap>
                        <v-flex xs12>{{item.careator}}</v-flex>
                        <v-flex xs12> <small class=" caption font-weight-bold">{{item.startDate|formatDate('YYYY-MM-DD')}} 至 {{item.endDate|formatDate('YYYY-MM-DD')}}</small></v-flex>
                        <v-flex xs12>
                           <div class="products"><v-chip small label  color="primary white--text" v-for="pd in item.products">{{pd}}</v-chip></div> 
                        </v-flex>
                    </v-layout>
                   
                </v-flex>
                <v-flex xs2 md2 v-if="$store.state.auth.token">
                    <v-chip label small outline v-if="item.invitation" class="primary--text">已邀请</v-chip>
                    <v-btn v-else small outline color="pink" @click="invitation(index)">求代购</v-btn>
                </v-flex>
                
             </v-layout>
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
    this.$http.get('/destinationuser', {destination: this.destination, user: this.$store.state.User.user.id}).then(res => {
      if (res.data.Status) {
        this.items = res.data.Data
        this.items.forEach((elmnt, index) => {
          console.log('this.purchase.inviters', this.purchase.inviters)
          if (this.purchase.inviters && this.purchase.inviters.indexOf(elmnt.createBy) != -1) {
            this.items[index].invitation = true
          }
        })
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
