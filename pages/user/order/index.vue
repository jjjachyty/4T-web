<template>
    <v-app>

               <v-navigation-drawer app  clipped width="170">
                   <v-divider></v-divider>
      <v-list>
        <v-list-tile v-for="item in items" :key="item.title" @click="active=item.id">
          <v-list-tile-action>
            <v-icon small :color="item.color">{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

    </v-navigation-drawer>
     <v-layout>
        <v-flex xs12 md6 offset-md3>
            <v-card>
            <v-tabs grow v-model="identity" fixed-tabs>
      <v-tabs-slider color="deep-orange"></v-tabs-slider>
            <v-tab @click="identity = 0" href="#buyer"><v-icon small>add_shopping_cart</v-icon>我是买家</v-tab>
            <v-tab @click="identity = 1" href="#seller"><v-icon small>shopping_cart</v-icon>我是卖家</v-tab>
            <v-tab-item id="buyer">
       <BuyPurchase></BuyPurchase>
            </v-tab-item>
                        <v-tab-item id="seller">
<SellPurchase></SellPurchase>
            </v-tab-item>
        </v-tabs>
        </v-card>

        </v-flex>
    </v-layout>


    </v-app>
</template>
<script>
import BuyPurchase from './buy/purchase/Main'
import SellPurchase from './sell/purchase/Main'

export default {
  components: {
    BuyPurchase,
    SellPurchase
  },
  middleware: 'authenticated',
  data () {
    return {
      tab: null,
      identity: 0,
      orders: [],
      active: 1,
      items: [{
        title: '代购',
        id: 1,
        icon: 'assignment_ind',
        color: 'primary'
      },
      {
        title: '转卖',
        id: 2,
        icon: 'how_to_reg',
        color: 'primary'
      },
      {
        title: '旅拍',
        id: 3,
        icon: 'fa-key',
        color: 'primary'
      }
      ]
    }
  },
  created () {

  }
}
</script>
