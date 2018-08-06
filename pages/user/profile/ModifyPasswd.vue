<template>
    <v-app>
        <v-container>
            <v-card flat>
            <v-layout row align-center justify-center wrap>
                <v-flex md7 xs12 v-if="modifyType != 4">
                    <v-text-field prepend-icon="fa-key" :append-icon="e ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (e = !e)" :type="e ? 'password' : 'text'" v-model="modifyPasswd.orgPasswd" @input="$v.modifyPasswd.orgPasswd.$touch()" @blur="$v.modifyPasswd.orgPasswd.$touch()" :error-messages="orgPasswdErrors" label="原密码"></v-text-field>
                </v-flex>
                <v-flex md7 xs12>
                                        <v-text-field :append-icon="e ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (e = !e)" :type="e ? 'password' : 'text'" v-model="modifyPasswd.newPasswd" @input="$v.modifyPasswd.newPasswd.$touch()" @blur="$v.modifyPasswd.newPasswd.$touch()" :error-messages="newPasswdErrors" prepend-icon="fa-exchange-alt" label="新密码"></v-text-field>

                </v-flex>
                <v-flex md7 xs12>
                                        <v-text-field :append-icon="e ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (e = !e)" :type="e ? 'password' : 'text'" v-model="modifyPasswd.confirmPasswd" :error-messages="confirmPassswdErrors" @input="$v.modifyPasswd.confirmPasswd.$touch()" @blur="$v.modifyPasswd.confirmPasswd.$touch()" prepend-icon="fa-check-circle" label="确认新密码"></v-text-field>

                </v-flex>
                <v-flex md6 xs6>
                                      <v-btn outline block color="primary" :disabled="disable" @click="submit">确认修改</v-btn>
                </v-flex>
                <v-flex xs12>
    
                </v-flex>
            </v-layout>
            </v-card>
</v-container>
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

export default {
  mixins: [validationMixin],
  validations: {
    modifyPasswd: {
      newPasswd: {
        required,
        passRule(v) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(v);
        },
        diffRule(v) {
          return v != this.modifyPasswd.orgPasswd;
        }
      },
      orgPasswd: {
        required,
        passRule(v) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/.test(v);
        }
      },
      confirmPasswd: { required, sameAsPassword: sameAs("newPasswd") }
    }
  },
  data() {
    return {
      e: true,
      snackbar: false,
      type: "error",
      message: "服务器异常",
      modifyType: 1,
      disable: false,
      modifyPasswd: { orgPasswd: "", newPasswd: "", confirmPasswd: "" }
    };
  },
  computed: {
    newPasswdErrors() {
      const errors = [];
      if (!this.$v.modifyPasswd.newPasswd.$dirty) return errors;
      !this.$v.modifyPasswd.newPasswd.passRule &&
        errors.push("需大于8位包含大小写字母和数字不包含特殊字符");
      !this.$v.modifyPasswd.newPasswd.diffRule &&
        errors.push("新密码与原密码相同");
      !this.$v.modifyPasswd.newPasswd.required && errors.push("新密码不能为空");
      return errors;
    },
    orgPasswdErrors() {
      const errors = [];
      if (!this.$v.modifyPasswd.orgPasswd.$dirty) return errors;
      !this.$v.modifyPasswd.orgPasswd.passRule &&
        errors.push("需大于8位包含大小写字母和数字不包含特殊字符");
      !this.$v.modifyPasswd.orgPasswd.required && errors.push("密码不能为空");
      return errors;
    },
    confirmPassswdErrors() {
      const errors = [];
      if (!this.$v.modifyPasswd.confirmPasswd.$dirty) return errors;
      !this.$v.modifyPasswd.confirmPasswd.required &&
        errors.push("密码不能为空");
      !this.$v.modifyPasswd.confirmPasswd.sameAsPassword &&
        errors.push("两次密码不一致");
      return errors;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (
        (this.modifyType != 4 && !this.$v.$invalid) ||
        !this.$v.modifyPasswd.confirmPasswd.$invalid
      ) {
        this.modifyPasswd.phone = this.$route.params.phone;
        this.$http
          .post("/user/modifypasswd", this.modifyPasswd)
          .then(res => {
            if (!res.data.Error) {
              this.$store.commit("SUCCESS", "密码修改成功");
              this.disable = true;
              this.$store.state.auth = {};
              setTimeout(() => {
                this.$router.push("/login");
              }, 1000);
            } else {
              this.$store.commit("ERROR", res.data.Error.Err);
            }
          })
          .catch(res => {
            this.$store.commit("ERROR", res);
          });
      }
    }
  },
  created() {
    this.modifyType = this.$route.params.active || 1;
  }
};
</script>
<style>
</style>
