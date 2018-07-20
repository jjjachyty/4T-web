<template>
<div>
    <v-layout v-if="products" row v-for="pd in products" :key="pd.id">
                  <v-flex xs2>
                    <v-card-media height="70">
                      <img :src="purchaseRoot+pd.images">
                    </v-card-media>
                  </v-flex>
                  <v-flex xs10>
                    <v-layout row wrap class="caption grey--text" align-center justify-center>
                      <v-flex xs10>名称：{{pd.name}}</v-flex>
                      <v-flex xs2>
                        <span>数量:{{pd.quantity}}</span>
                      </v-flex>
                      <v-flex xs10>购买渠道:{{pd.shopName}}</v-flex>
                      <v-flex xs2>¥{{pd.price}}</v-flex>
                    </v-layout>

                  </v-flex>
                </v-layout>
                </div>
</template>
<script>
export default {
  props: ['products']
}
</script>


