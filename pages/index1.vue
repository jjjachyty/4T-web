<template>
<v-app>

</v-app>
</template>
<script>
import Header from "~/components/Header";

export default {
  layout: "hasheader",
  components: {
    Header,
    Main
  },
  metaInfo() {
    return {
      title: "4T For Travael 旅游 爆料 代购 转卖 旅拍",
      meta: [
        {
          name: "description",
          content:
            "国外[香港、澳门、日本、韩国、美国、德国、泰国、欧洲] 旅游曝光 物流代购 转卖 旅拍"
        }
      ]
    };
  },
  asyncData() {}
};
</script>
<style>
</style>
