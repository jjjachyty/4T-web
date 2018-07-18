<template>
    <v-app>
          <v-layout>
      <v-flex offset-md3 md5>
        <v-text-field  prepend-inner-icon="search" @click:clear="clear" @keyup.enter="serach" v-model="keyWords" solo clearable placeholder="搜索 例：IPhonex 香港"></v-text-field>
      </v-flex>
    </v-layout>
                    <v-layout>
                        <v-flex md8 offset-md2>
                            <!-- <List :items="items"></List> -->
                        </v-flex>
                       
                    </v-layout>          
    </v-app>
</template>
<script>
import List from './purchaseList'
export default {
  components: {
    List
  },
  data () {
    keyWords: ''
  },
  computed: {
    items () {
      return this.$store.state.Purchase.purchases
    }
  },
  methods: {
    serach () {
      this.$http.get('/purchases', this.keyWords).then(res => {
        if (res.data.Status) {
          this.$store.commit('GET_PURCHASES_SUCCESS', res.data.Data)
        }
      })
    },
    clear () {
      this.keyWords = null
      this.serach()
    }
  },
  head () {
    var description = new Array()
    var keywords = new Array()
    this.$store.state.Purchase.purchases.forEach(element => {
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

    return {
      title: description.toString(),
      meta: [{
        name: 'keyWords',
        content: keywords
      }]
    }
  },
  fetch (context) {
    context.$http
      .get('/purchases', {})
      .then(res => {
        if (res.data.Status) {
          context.store.commit('GET_PURCHASES_SUCCESS', res.data.Data)
        } else {
          context.error({
            statusCode: 400,
            message: res.data.Error.Err
          })
        }
      })
      .catch(res => {
        context.error({
          statusCode: 401,
          message: res
        })
      })
  }
}
</script>
<style scoped>
.serach {
  max-width: 500px;
}
.tab-tips {
  font-size: 1px;
}
</style>
