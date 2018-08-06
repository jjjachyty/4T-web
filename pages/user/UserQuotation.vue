<template>
    <v-app>
        
        <v-container grid-list-xs>
            <div v-if="items.length == 0" class="text-xs-center grey--text">
                <small >空空如也,赶紧去接[求代购单]吧</small>
            </div>
            <v-layout v-else>
                <v-flex v-for="item in items" :key="item.id">
                <v-card :to="/purchase/+item.purchaseID">
                    <v-layout>
                        <v-flex xs2>
                            <v-card-media height="100">
                                <img :src="purchaseRoot + item.products[0].images">
                            </v-card-media>
                        </v-flex>
                        <v-flex xs10>
                            <v-layout row wrap>
                                <v-flex xs10>
                                    单号:{{item.id}}
                                </v-flex>
                                <v-flex xs2>
                                    <small class="red--text">{{item.state|dict('quotationType')}}</small>
                                </v-flex >
                                <v-flex xs6>
                                    <div>总价<small class="red--text body-2">¥{{item.amount}}</small></div> 
                                </v-flex>
                                <v-flex offset-xs2 xs4>
                                    <div>代购费<small class="red--text body-2">¥{{item.charge}}</small></div>
                                </v-flex>
                                <v-flex xs12>
                                     发货时间{{item.deliveryTime | formatDate("YYYY-MM-DD")}}
                                </v-flex>
                                <v-flex xs >
                                    <span v-if="item.state != '-1'"><small class="red--text">{{getLeft(item.expiryTime)}} </small></span>
                                    <span v-if="item.state == '0'"><small class="red--text">{{getLeft(item.refuseReason)}} </small></span>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                    </v-layout>
                </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script>
export default {
  data() {
    return {
      items: []
    };
  },
  computed: {},
  methods: {
    getLeft(expiryTime) {
      var rest = "";
      var mins = parseInt(
        (this.string2Date(expiryTime).getTime() - new Date().getTime()) /
          1000 /
          60
      );
      var hous = parseInt(mins / 60);
      var days = parseInt(hous / 24);
      if (days > 0) {
        rest += days + "天";
      } else if (hous > 0) {
        rest += hous + "小时";
      } else if (mins > 0) {
        rest += mins + "分钟后失效";
      } else if (rest == "") {
        rest = "已过期";
      }
      return rest;
    }
  },
  created() {
    this.$http.get("/user/quotations", {}).then(res => {
      if (res.data.Status) {
        this.items = res.data.Data;
      }
    });
  }
};
</script>
