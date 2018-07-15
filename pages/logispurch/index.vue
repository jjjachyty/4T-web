<template>
    <v-app>
                    <v-layout>
                        <v-flex md8 offset-md2>
                            <List :items="items"></List>
                        </v-flex>
                       
                    </v-layout>          
    </v-app>
</template>
<script>
import List from "./List";

export default {
  layout: "hasheader",
  components: {
    List
  },
  metaInfo() {
    return {
      title: this.title,
      meta: this.meta
    };
  },
  asyncData({ params, error }) {
    return api
      .get("/purchases", {})
      .then(res => {
        if (res.data.Status) {
          var items = res.data.Data;
          var description = new Array();
          var keywords = new Array();
          items.forEach(element => {
            if (keywords.indexOf(element.destination) == -1) {
              keywords.push(element.destination);
            }
            element.products.forEach(pd => {
              if (
                description.indexOf(element.destination + "代购" + pd.name) ==
                -1
              ) {
                description.push(element.destination + "代购" + pd.name);
              }
              if (keywords.indexOf(pd.name) == -1) {
                keywords.push(pd.name);
              }
            });
          });
          return {
            items: items,
            title: description,
            meta: [{ name: "keyWords", content: keywords }]
          };
        } else {
          error({ statusCode: 400, message: res.data.Error.Err });
        }
      })
      .catch(res => {
        error({ statusCode: 400, message: res.data });
      });
  }
};
</script>
<style scoped>
.tab-tips {
  font-size: 1px;
}
</style>
