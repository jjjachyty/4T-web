<template>
  <v-app id="login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md3>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary" class="white--text">
                <v-toolbar-title><a href='/' class="white--text">4T&nbsp;<small class="caption">_为美好旅行</small></a></v-toolbar-title>
                <v-spacer></v-spacer>
                        <v-btn flat small color="white" to="register">注册</v-btn>


              </v-toolbar>
              <v-card-text>
                <v-form ref="form"  lazy-validation>
                  <v-text-field prepend-icon="person"  name="login" required label="手机号" clearable @input="$v.user.username.$touch()" @blur="$v.user.username.$touch()" :error-messages="phoneErrors" type="text" v-model="user.username"></v-text-field>
                  <v-text-field id="password" @keyup.enter.native="submit" prepend-icon="lock" clearable @input="$v.user.password.$touch()" @blur="$v.user.password.$touch()" name="password" label="密码" :error-messages="passwdErrors" type="password" v-model="user.password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn flat="" to="forgot"  class="primary--text caption">忘记密码?</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary"  outline @click="submit"  :disabled="this.$v.$invalid">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { setToken } from '~/utils/auth'
import { mapActions, mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import {
  required,
  sameAs,
  minLength,
  maxLength,
  phone
} from 'vuelidate/lib/validators'

export default {
  layout: 'noheader',
  mixins: [validationMixin],
  validations: {
    user: {
      password: {
        required,
        passRule (v) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(v)
        }
      },
      username: {
        required,
        phoneRule (v) {
          return /^[1][3,4,5,7,8][0-9]{9}$/.test(v)
        }
      }
    }
  },
  data () {
    return {
      valid: false,
      user: { username: '', password: '' }
    }
  },
  computed: {
    phoneErrors () {
      const errors = []
      if (!this.$v.user.username.$dirty) return errors
      !this.$v.user.username.phoneRule && errors.push('手机号格式不正确')
      !this.$v.user.username.required && errors.push('手机号不能为空')
      return errors
    },
    passwdErrors () {
      const errors = []
      if (!this.$v.user.password.$dirty) return errors
      !this.$v.user.password.passRule &&
        errors.push('需大于8位包含大小写字母和数字不包含特殊字符')
      !this.$v.user.password.required && errors.push('密码不能为空')
      return errors
    }
  },
  methods: {
    async submit () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.$http.post('/login', this.user).then(res => {
          console.log('login-res------', res)
          if (res.data.Error) {
            console.log('res----', res.data.Error)
            this.$store.commit('ERROR', res.data.Error.Err)
          } else {
            // this.$store.commit('LOGIN_SUCCESS', res.data) // 登陆成功
            setToken(res.data.token)

            var path = this.$route.query.redirect || '/'
            this.$router.push(path)
          }
        })
      }
    }
  },
  created () {}
}
</script>
<style scoped>
#login {
  background-image: url("/static/login.png");
  background-size: 100%;
}
.application .theme--light.card,
.theme--light .card {
  background-color: #f5f5f557;
}
.application .theme--dark.toolbar,
.theme--dark .toolbar {
  background-color: transparent;
  color: #fff;
}
</style>
