<template>
  <v-app id="register">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12 ">
              <v-toolbar dark="" color="deep-orange">
                <v-toolbar-title class=""><a href="/" class="white--text">4T&nbsp;<small class="caption">_为美好旅行</small></a></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn flat small color="white" to="/login">登录</v-btn>


              </v-toolbar>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field   prepend-icon="person" required :error-messages="phoneErrors" name="login" @input="$v.register.phone.$touch()"
                    @blur="$v.register.phone.$touch()" label="手机号" type="text" v-model="register.phone"></v-text-field>
                  <v-text-field required id="password" prepend-icon="lock" :error-messages="passwdErrors" @input="$v.register.passwd.$touch()"
                    @blur="$v.register.passwd.$touch()" :append-icon-cb="() => (e = !e)" :type="e ? 'password' : 'text'" name="password"
                    :append-icon="e ? 'visibility_off' : 'visibility'" label="密码" v-model="register.passwd"></v-text-field>
                  <v-text-field required id="confirmPassswd" prepend-icon="lock" :error-messages="confirmPassswdErrors" @input="$v.register.confirmPasswd.$touch()"
                    @blur="$v.register.confirmPasswd.$touch()" name="confirmPassswd" label="确认密码" :type="e ? 'password' : 'text'"
                    :append-icon="e ? 'visibility_off' : 'visibility'" v-model="register.confirmPasswd"></v-text-field>
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
                                     <v-text-field prepend-icon="message" required name="smsCode" 
                     label="短信验证码" type="text" v-model="register.smsCode"></v-text-field>
   
                    </v-flex>
                    <v-flex>
                      <v-btn  color="white"  outline @click="showCaptcha" :disabled="smstbnState">{{smstbnText}}</v-btn>
                    </v-flex>
                  </v-layout>

                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="deep-orange" class="white--text" @click="submit" :loading="loading">确定</v-btn>
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
      <v-card color="white">
        <v-card-title>
          <span>请输入图片中的验证码</span>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex>
              <img class="captcha" :src="captchaUrl+'?'+random" @click="refreshcaptcha">
            </v-flex>
            <v-flex>
              <v-text-field maxlength="4" id="captcha" required name="captcha" label="验证码" type="number" counter="4" v-model="register.captchaSolution"></v-text-field>

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
import { mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  sameAs,
  minLength,
  maxLength,
  phone
} from "vuelidate/lib/validators";
import { apiRoot } from "@/config";

export default {
  layout: "noheader",
  mixins: [Mixin, validationMixin],
  validations: {
    register: {
      passwd: {
        required,
        passRule(v) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(v);
        }
      },
      phone: {
        required,
        phoneRule(v) {
          return /^[1][3,4,5,7,8][0-9]{9}$/.test(v);
        }
      },
      confirmPasswd: { required, sameAsPassword: sameAs("passwd") }
      // smsCode:{required}
    }
  },
  data: () => ({
    countDown: 59,
    valid: false,
    loading: false,
    smstbnState: false,
    show: false,
    smstbnText: "发送验证码",
    error: false,
    message: "",
    captchaState: false,
    e: true,
    register: {
      phone: "",
      passwd: "",
      confirmPasswd: "",
      captchaSolution: "",
      captchaId: "",
      smsCode: ""
    },
    random: "0",
    captchaSolution: "",
    captchaUrl: ""
  }),
  computed: {
    phoneErrors() {
      const errors = [];
      if (!this.$v.register.phone.$dirty) return errors;
      !this.$v.register.phone.phoneRule && errors.push("手机号格式不正确");
      !this.$v.register.phone.required && errors.push("手机号不能为空");
      return errors;
    },
    passwdErrors() {
      const errors = [];
      if (!this.$v.register.passwd.$dirty) return errors;
      !this.$v.register.passwd.passRule &&
        errors.push("需大于8位包含大小写字母和数字不包含特殊字符");
      !this.$v.register.passwd.required && errors.push("密码不能为空");
      return errors;
    },
    confirmPassswdErrors() {
      const errors = [];
      if (!this.$v.register.confirmPasswd.$dirty) return errors;
      !this.$v.register.confirmPasswd.required && errors.push("密码不能为空");
      !this.$v.register.confirmPasswd.sameAsPassword &&
        errors.push("两次密码不一致");
      return errors;
    }
    // smsCodeErrors(){
    //   const errors = []
    //   if (!this.$v.register.smsCode.$dirty) return errors
    //   !this.$v.register.smsCode.required && errors.push('请输入验证码')
    //   return errors
    // }
  },
  methods: {
    ...mapActions({
      siginUp: "register",
      sendRegSms: "sendRegisterSMS" // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    }),
    showCaptcha() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        // 所有的验证通过
        // 弹出验证码，防止短信轰炸
        this.captchaState = false;
        this.show = true;
      }
    },
    sendSms() {
      this.captchaState = false;
      if (
        this.register.captchaSolution != "" &&
        this.register.captchaSolution.length == 4
      ) {
        this.sendRegSms({
          phone: this.register.phone,
          captchaId: this.register.captchaId,
          captchaSolution: this.register.captchaSolution,
          smsType: "1"
        })
          .then(res => {
            if (res.data.Status) {
              // 短信发送成功
              this.show = false;
              var timer = setInterval(() => {
                if (this.countDown > 0) {
                  this.smstbnText = "发送成功(" + this.countDown + ")";
                  this.countDown--;
                } else {
                  this.smstbnText = "发送验证码";
                  this.smstbnState = false;
                  clearInterval(timer);
                }
              }, 1000);
              this.smstbnState = true;
              this.show = false;
            } else {
              this.$store.commit("ERROR", res.data.Error.Err);
              this.refreshcaptcha();
            }
          })
          .catch(res => {
            this.$store.commit("ERROR", res.data);
            this.captcha();
          });
      } else {
        this.captchaState = true;
        this.message = "验证码格式错误";
      }
    },
    refreshcaptcha() {
      this.random = Math.random();
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;

        this.siginUp(this.register)
          .then(res => {
            console.log("Res.data", res.data);
            if (res.data.Status) {
              this.error = false;
              this.$router.push({
                name: "profile",
                params: { id: res.data.Data.user.id }
              });
              this.$store.commit("SUCCESS", "注册成功，请登陆");
            } else {
              this.refreshcaptcha();

              this.$store.commit("ERROR", res.data.Error.Err);
            }
            this.loading = false;
          })
          .catch(data => {
            this.$store.commit("ERROR", data.data);
            this.loading = false;
          });
      }
    }
  },
  created() {
    this.register.captchaId = this.uuid(8, 16);
    this.captchaUrl = apiRoot + "/api/v1/captcha/" + this.register.captchaId;
  }
};
</script>
<style scoped>
#register {
  background-image: url("/static/register.png");
  background-size: 100%;
  background-size: cover;
}
.captcha {
  /* height: 10px; */
  width: 100%;
}
.application .theme--light.card,
.theme--light .card {
  background-color: rgba(256, 256, 256, 0.5);
}
.application .theme--dark.toolbar,
.theme--dark .toolbar {
  background-color: transparent;
  color: #fff;
}
</style>
