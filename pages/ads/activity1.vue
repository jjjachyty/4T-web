<template >
<v-app > 
   <v-container fluid fill-height > 

        <v-layout row wrap>
          <v-flex offset-md3 md6>
            <v-card height="500" class="activity-bg">
               
              <v-card-text>
 <span class="title white--text">活动规则:</span><br/>

<ul class="body-1 white--text">
    <li>在本平台发布曝光文章并通过审核</li>
       <li>该月点赞数需超过10个(不包含10个)即可获得活动资格</li>
       <li>统计点赞数从该月1号至该月自然日结束日</li>
       <li>该月排名第一的即可获得该月奖品,奖品请见下面活动商品</li>
       <li>本活动与该站其他活动不重叠</li>
       <li>中奖奖品会在活动月的下一个月初发放,请务必填好收货地址</li>
       <li>本平台拥有该活动的所有解释权</li>

</ul>

  <carousel v-if="showCarousel">
  <slide>
  
       <a href="http://www.garmin.com.cn/products/intosports/vivoactive3x/">
        <img src="/activity/1-1.png">
      <v-subheader class="white--text">¥2180 vivoactive3 黑色</v-subheader> </a>

  </slide>
  <slide>
   <a href="http://www.garmin.com.cn/products/intosports/vivoactive3x/">
      <img src="/activity/1-2.png">

   <v-subheader class="white--text">¥2180 vivoactive3 白色</v-subheader> </a>
  </slide>
</carousel>
              </v-card-text>

              </v-card>
          </v-flex>

        </v-layout>
</v-container>
    </v-app>

</template>
<script>

export default {
  data () {
    return {
      showCarousel:false,
      items: [
        {
          src: '/static/activity/1-1.png'
        },
        {
          src: '/static/activity/1-2.png'
        }
      ]
    }
  },
  mounted () {
              this.showCarousel = true
  }
}
</script>
<style scoped>
.activity-prd{
    height: 250px;
}
.card{
    background-color: transparent !important;
    color: white;
}
</style>
<style>
.activity-bg{
    background:url('/static/activity/bg.jpeg');
}
</style>
