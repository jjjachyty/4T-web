<template>
         <v-list subheader>
          <v-subheader>{{date}}点赞排行榜(>10)</v-subheader>
          <v-divider></v-divider>
          <v-list-tile v-for="(item,index) in items" :key="item.id"  :to='"/article/"+item.id'>
            <v-list-tile-content>
                <span class="caption">
                {{index+1}}.{{item.title}}
              </span>
            </v-list-tile-content>
            <v-list-tile-action>
                <span class="red--text caption"> <v-icon
                small=""
                  color="yellow darken-2"
                >thumb_up_alt</v-icon>{{item.thumbsUps}}</span>
               
              </v-list-tile-action>
          </v-list-tile>
          <v-subheader class="caption" v-if="items.length < 1">恭喜暂无人上榜,赶紧发布文章赢奖品吧～</v-subheader>
        </v-list>
</template>

<script>
export default {
  data () {
    return {
      items: [],
      date: null
    }
  },
  mounted () {
    this.$http.get('/topexparticles', { sort: '-thumbsUps', limit: 10 })
      .then(res => {
        this.items = res.data.Data
      })
    this.date = this.formatDate(new Date(), 'YYYYMM')
  }
}
</script>
