<template>
  <v-app id="login">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 ">
              <v-toolbar dark="" color="primary">
                <v-toolbar-title>找回密码</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn flat small color="white" to="/login">登录</v-btn>


              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field prepend-icon="person" required :error-messages="phoneErrors" name="login" @input="$v.register.phone.$touch()"
                    @blur="$v.register.phone.$touch()" label="手机号" type="text" v-model="register.phone"></v-text-field>
                  <!-- <v-text-field required id="password" prepend-icon="lock" :error-messages="passwdErrors" @input="$v.register.passwd.$touch()"
                    @blur="$v.register.passwd.$touch()" :append-icon-cb="() => (e = !e)" :type="e ? 'password' : 'text'" name="password"
                    :append-icon="e ? 'visibility_off' : 'visibility'" label="密码" v-model="register.passwd"></v-text-field>
                  <v-text-field required id="confirmPassswd" prepend-icon="lock" :error-messages="confirmPassswdErrors" @input="$v.register.confirmPasswd.$touch()"
                    @blur="$v.register.confirmPasswd.$touch()" name="confirmPassswd" label="确认密码" :type="e ? 'password' : 'text'"
                    :append-icon="e ? 'visibility_off' : 'visibility'" v-model="register.confirmPasswd"></v-text-field> -->
                  <!-- <v-layout row>
                      <v-flex>
                          <img class="captcha"  :src="captchaUrl+'?'+random" @click="captcha">
                      </v-flex>
                      <v-flex>
                    <v-text-field id="captcha" name="captcha" label="验证码"  :error-messages="captchaSolutionErrors"  type="number" counter="4"  v-model="register.captchaSolution"></v-text-field>

                      </v-flex>
                  </v-layout> -->

                  <v-layout row>
                    <v-flex>
                      <!-- <v-text-field prepend-icon="message" id="captcha" required  :error-messages="smsCodeErrors" name="captcha"  @input="$v.register.smsCode.$touch()"
                    @blur="$v.register.smsCode.$touch()" label="短信验证码" type="number" counter="4" v-model="register.smsCode"></v-text-field>
                     -->
                                     <v-text-field prepend-icon="message" :error-messages="smsCodeErrors"  @blur="$v.register.smsCode.$touch()" required name="smsCode" 
                     label="短信验证码" type="text" v-model="register.smsCode"></v-text-field>
   
                    </v-flex>
                    <v-flex>
                      <v-btn  color="primary"  outline @click="showCaptcha" :disabled="smstbnState">{{smstbnText}}</v-btn>
                    </v-flex>
                  </v-layout>

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit" :loading="loading">确定</v-btn>
              </v-card-actions>
            </v-card>
            <!-- <v-card class="elevation-12 " v-if="step ==2">
                           <v-card-title>恭喜您注册成功,请前往邮箱验证...</v-card-title>
                         </v-card> -->
            <v-alert v-model="error" type="error">
              {{message}} </v-alert>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <!-- 验证码 -->
    <v-dialog v-model="show" max-width="500px">
      <v-card>
        <v-card-title>
          <span>请输入图片中的验证码</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex>
              <img class="captcha" :src="captchaUrl+'?'+random" @click="captcha">
            </v-flex>
            <v-flex>
              <v-text-field id="captcha" required name="captcha" label="验证码" type="number" counter="4" v-model="register.captchaSolution"></v-text-field>

            </v-flex>
            <v-flex>
              <v-btn outline color="primary" @click="sendSms">确认</v-btn>
            </v-flex>
            <v-flex xs12>
              <v-alert v-model="captchaState" type="error">
                {{message}}
              </v-alert>
            </v-flex>
          </v-layout>
        </v-card-text>

      </v-card>
    </v-dialog>

  </v-app>
</template>


<script>
import {mapActions} from 'vuex'
import {apiRoot} from '@/config'
import { validationMixin } from 'vuelidate'
import { required, sameAs, minLength, maxLength, phone } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    register: {
      phone: { required,
        phoneRule (v) {
          return /^[1][3,4,5,7,8][0-9]{9}$/.test(v)
        }},
      smsCode: {required, minLength, maxLength}
    }

  },
  data: () => ({
    countDown: 59,
    valid: false,
    loading: false,
    smstbnState: false,
    show: false,
    smstbnText: '发送验证码',
    error: false,
    message: '',
    captchaState: false,
    e: true,
    register: {phone: '', passwd: '', confirmPasswd: '', captchaSolution: '', captchaId: '', smsCode: ''},
    random: '0',
    captchaSolution: '',
    captchaUrl: ''
  }),
  computed: {
    phoneErrors () {
      const errors = []
      if (!this.$v.register.phone.$dirty) return errors
      !this.$v.register.phone.phoneRule && errors.push('手机号格式不正确')
      !this.$v.register.phone.required && errors.push('手机号不能为空')
      return errors
    },
    smsCodeErrors () {
      const errors = []
      if (!this.$v.register.smsCode.$dirty) return errors
      !this.$v.register.smsCode.minLength(4) && errors.push('验证码格式错误')
      !this.$v.register.smsCode.required && errors.push('验证码不能为空')
      return errors
    }

  },
  methods: {
    ...mapActions({
      loginWithPhone: 'phoneLogin',
      sendRegSms: 'sendRegisterSMS' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`

    }),
    showCaptcha () {
      this.$v.$touch()
      if (!this.$v.$invalid) { // 所有的验证通过
        // 弹出验证码，防止短信轰炸
        this.captchaState = false
        this.show = true
      }
    },
    sendSms () {
      if (this.register.captchaSolution != '' && this.register.captchaSolution.length == 4) {
        this.sendRegSms({phone: this.register.phone, captchaId: this.register.captchaId, captchaSolution: this.register.captchaSolution}).then(res => {
          if (res.data.Status) {
            // 短信发送成功
            this.show = false
            var timer = setInterval(() => {
              if (this.countDown > 0) {
                this.smstbnText = '发送成功(' + this.countDown + ')'
                this.countDown--
              } else {
                this.smstbnText = '发送验证码'
                this.smstbnState = false
                clearInterval(timer)
              }
            }, 1000)
            this.smstbnState = true
            this.show = false
          } else {
            this.$store.commit('ERROR', res.data.Error.Err)
            this.captcha()
          }
        }).catch(res => {
          console.log('res', res)
          if (res.data.Error) {
            switch (res.Error.Code) {
              case 1001:
                this.captchaState = true
                this.message = '验证码输入错误'
                this.captcha()
                break
              default:
                this.captchaState = true
                this.message = res.Error.Err
            }
          }
        })
      } else {
        this.captchaState = true
        this.message = '验证码格式错误'
      }
    },
    captcha () {
      this.random = Math.random()
    },
    submit () {
      // 短信登陆
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.loading = true

        this.loginWithPhone(this.register).then(res => {
          console.log('aaa', res)
          if (!res.data.Status) {
            switch (res.data.Error.Code) {
              case 1001:
                this.error = true
                this.message = res.data.Error.Err
                this.captcha()
                this.loading = false
                break
            }
          } else {
            this.error = false
            this.$store.commit('LOGIN_SUCCESS', res.data.Data)

            this.$router.push({ name: 'profile', params: {id: res.data.Data.user.id, active: 4, phone: this.register.phone}})
            this.loading = false
          }
        }).catch((res) => {
          this.loading = false
        })
      } else {
        this.$store.commit('ERROR', '表单信息错误')
      }
    }
  },
  created () {
    this.register.captchaId = this.uuid(8, 16)
    this.captchaUrl = apiRoot + '/captcha/' + this.register.captchaId
  }
}
</script>
<style>
#login{
    background-image: url('/static/login.png');
    background-size: 100%;
}
.captcha{
  /* height: 10px; */
  width: 100%;
}
</style>
