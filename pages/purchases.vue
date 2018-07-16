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
import List from './purchaselist'

export default {
  components: {
    List
  },
  asyncData (context) {
    return context.$http
      .get('/purchases', {})
      .then(res => {
        if (res.data.Status) {
          var items = res.data.Data
          var description = new Array()
          var keywords = new Array()
          items.forEach(element => {
            if (keywords.indexOf(element.destination) == -1) {
              keywords.push(element.destination)
            }
            element.products.forEach(pd => {
              if (description.indexOf(element.destination + '代购' + pd.name) == -1) {
                description.push(element.destination + '代购' + pd.name)
              }
              if (keywords.indexOf(pd.name) == -1) {
                keywords.push(pd.name)
              }
            })
          })
          context.app.head.title = description.toString()
          context.app.head.meta.push({ name: 'keyWords', content: keywords })
          return {
            items: items
          }
        } else {
          context.error({ statusCode: 400, message: res.data.Error.Err })
        }
      })
      .catch(res => {
        context.error({ statusCode: 401, message: res })
      })
  }
}
</script>
<style scoped>
.tab-tips {
  font-size: 1px;
}
</style>
