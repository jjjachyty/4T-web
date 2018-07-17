<template>
    <v-app>
        <v-container fluid fill-height>
           
            
            <v-alert v-model="error" :type="type">
{{message}}    </v-alert>

        </v-container>

    </v-app>
</template>
<script>
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      error: false,
      message: '',
      type: 'error'
    }
  },
  methods: {
    ...mapActions({
      emailVaild: 'emailVaild' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  },
  mounted () {
    console.log('this.$store.$route.params.id', this.$route.params)
    this.emailVaild({id: this.$route.params.id, code: this.$route.params.code}).then(res => {
      this.type = 'success'
      this.error = true
      this.message = '恭喜你,邮箱验证成功,2S后跳转登陆'
      setTimeout(() => {
        this.$router.push('/login')
      }, 2000)
    }).catch(res => {
      if (res.Error.Code) {
        this.error = true
        this.message = res.Error.Err
      }
    })
  }

}
</script>
