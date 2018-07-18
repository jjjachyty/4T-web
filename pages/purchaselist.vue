<template>
  <div class="" >


    <!-- <p class="text-xs-right">
       <v-btn-toggle v-model="purchType" >
        <v-btn  small :value="0" color="red" class="white--text" @click="sort">
           时间
                     <v-icon>arrow_drop_down</v-icon>
            </v-btn>
        <v-btn small color="teal" :value="1" class="white--text" @click="sort">金额
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
      </v-btn-toggle>
       <v-btn icon outline color="primary" @click="filter = !filter">
        <v-icon>filter_list</v-icon>
      </v-btn> 
    </p> -->
    <v-container grid-list-lg v-if="items">
      <div class="text-xs-center">
      <small v-if="items.length < 1" class="grey--text">没有<small class="red--text">{{keyWords}}</small>有关的数据,建议更换搜索试试</small>
      </div>
      <v-layout row wrap>
        <v-flex md3 xs12 v-for=" item in items" :key="item.id">
          <nuxt-link :to="/purchase/+item.id">
          <v-card>
            <v-layout row>
              <v-flex xs8 md10>

                <!-- <span>
                  <v-chip v-if="item.type=='0'"  small color="red" label class="white--text">
                   求购
                  </v-chip>
                  <v-chip  v-else small color="teal" label class="white--text">
                   代购
                  </v-chip>
                </span> -->
                <v-chip small label color="teal" v-if="item.state == 0"><small class="caption white--text">可接单</small></v-chip>
                <v-chip small label color="grey" v-else><small class="caption white--text">报价中</small></v-chip>
              </v-flex>
              <v-flex xs4 md5>
                  <v-chip small color="red"  label class="white--text body-2">
                    <div v-if="item.amount"><small class="caption" >预计¥</small>{{item.amount}}</div>
                    <small class="caption" v-else>求报价</small>
                    </v-chip>
              </v-flex>
            </v-layout>

            <v-card-media v-if="item.products" class="white--text" height="200px" :src="purchaseRoot+item.products[0].images+'?'+Number(new Date())">
            </v-card-media>
            <v-card-text>
              <div v-for="pd in item.products">

              </div>
            </v-card-text>
            <v-card-title class="grey--text">
                <div class="content">{{item.content}}</div>
            </v-card-title>

            <v-card-actions>
              <v-badge overlap>
              <v-avatar size="30">
                <img :src="avatarRoot+item.createBy">
              </v-avatar>
              <span slot="badge">实</span>
              </v-badge>
              <v-spacer></v-spacer>
              <v-icon small>pin_drop</v-icon>
              <span class="caption grey--text">{{item.destination}}</span>
            </v-card-actions>

          </v-card>
         </nuxt-link>
        </v-flex>


      </v-layout>
    </v-container>
  </div>
</template>
<script>
import { Carousel, Slide } from 'vue-carousel'
import { avatarRoot } from '~/config'

export default {
  components: {
    Carousel,
    Slide
  },
  props: ['items'],
  data () {
    return {
      purchType: 0,
      keyWords: '',
      filter: false,
      filters: {},
      avatarRoot: avatarRoot
    }
  },
  methods: {
    toDetail (item) {
      this.$router.push('/purchase/' + item.id)
    }
  }
}
</script>
<style scoped>
.img-herder img {
  height: 150px;
  width: 100%;
}
.img-herder {
  border-color: red;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-content: center;
}
.sort-btn {
}
.purch-type {
  margin-left: -20px;
}
.purch-price {
  float: right;
}
.tags {
  height: 40px;
  overflow: scroll;
}
.content {
  max-height: 20px;
  overflow: hidden;
  word-wrap: break-word;
  max-width: 100%;
}
</style>
