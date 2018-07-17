<template>
  <v-app>
      <v-layout row wrap>
        <v-flex  v-if="edit || !certified">
        <v-card>
       
           <v-divider></v-divider>
          <v-card-text>

            <v-layout row wrap>

              <v-flex xs11>
                <v-subheader>身份证正面</v-subheader>
              </v-flex>
              <v-flex md9>
                <croppa v-model="idCard1" :accept="'image/*'" @new-image-drawn="handleNewImage(1)" :height="125" placeholder="" image-border-radius="50">
                  <img slot="placeholder" src="/static/idcard1.png">

                </croppa>

              </v-flex>
              <v-flex xs7 md4>
                <v-subheader>身份证反面</v-subheader>
              </v-flex>
              <v-flex md9>
                <croppa v-model="idCard2" :accept="'image/*'" :height="125" placeholder="" @new-image-drawn="handleNewImage(2)" image-border-radius="50">
                  <img slot="placeholder" src="/static/idcard2.png">
                </croppa>
              </v-flex>
              <v-flex>
                <v-alert v-model="showError" :type="type">
                  {{errorMessage}}
                </v-alert>
              </v-flex>
            </v-layout>
          </v-card-text>

        </v-card>
        </v-flex>

        <v-flex md12>
        <v-card>
          <v-card-title class="subheading">身份信息（<span>{{certified==true?'认证通过':'待认证' }}）</span></v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs4>
                <v-subheader class="black--text">姓名:</v-subheader>
              </v-flex>
              <v-flex xs7 md10>
                <v-subheader>{{idCardF.name}}</v-subheader>
              </v-flex>
              
              <v-flex xs4>
                <v-subheader class="black--text">性别:</v-subheader>

              </v-flex>
              <v-flex xs1 md3>
                <v-subheader>{{idCardF.gender}}</v-subheader>
              </v-flex>
              <v-flex xs4 md2>
                <v-subheader class="black--text">名族:</v-subheader>

              </v-flex>
              <v-flex md3>
                <v-subheader>{{idCardF.race}}</v-subheader>
              </v-flex>
              <v-flex xs4 md2>
                <v-subheader class="black--text">出生日月:</v-subheader>

              </v-flex>
              <v-flex xs7 md9>
                <v-subheader>{{idCardF.birthday}}</v-subheader>
              </v-flex>
              <v-flex xs4 md2>
                <v-subheader class="black--text">住址:</v-subheader>

              </v-flex>
              <v-flex xs8 md10>
                <v-subheader>{{idCardF.address}}</v-subheader>
              </v-flex>
              <v-flex xs4 md2>
                <v-subheader class="black--text">证件号码:</v-subheader>

              </v-flex>
              <v-flex xs8 md9>
                <v-subheader>{{idCardF.id_card_number}}</v-subheader>
              </v-flex>
              <v-flex xs4 md2>
                <v-subheader class="black--text">有效期限:</v-subheader>

              </v-flex>
              <v-flex xs8 md9>
                <v-subheader>{{idCardB.valid_date}}</v-subheader>
              </v-flex>
              <v-flex xs4 md2>
                <v-subheader class="black--text">签发机关:</v-subheader>

              </v-flex>
              <v-flex xs8 md9>
                <v-subheader>{{idCardB.issued_by}}</v-subheader>
              </v-flex>
                <v-flex xs6 offset-xs3>
                <v-btn v-show="!certified " block color="primary" outline @click="submit">确定</v-btn>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
</v-flex>
      </v-layout>
  </v-app>
</template>


<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
export default {
  props: ['idCardF', 'idCardB', 'certified'],
  data () {
    return {
      edit: false,
      showError: false,
      errorMessage: '',
      type: 'error',
      idCard1: {},
      idCard2: {}
      // certified:false,
      // idCardF: {
      //   name: ""
      // },
      // idCardB:{

      // }
    }
  },
  methods: {
    ...mapActions({
      idCardOCR: 'idCardOCR',
      valid: 'identification'

    }),
    upload () {
      if (!this.croppa.hasImage()) {
        alert('no image to upload')
        return
      }

      this.croppa.generateBlob((blob) => {
        var fd = new FormData()
        fd.append('file', blob)
        fd.append('other', 'blahblahblah')
        $.ajax({
          url: 'http://www.xxx.com/api/upload',
          data: fd,
          type: 'POST',
          processData: false,
          contentType: false,
          success: function (data) {
            alert(data)
          }
        })
      })
    },
    submit () {
      if (this.idCardF.id_card_number && this.idCardB.valid_date) {
        this.idCardF.issued_by = this.idCardB.issued_by
        this.idCardF.valid_date = this.idCardB.valid_date
        this.valid(this.idCardF).then(res => {
          this.showError = true
          this.type = 'success'
          this.errorMessage = '认证成功'
          this.edit = false
          this.certified = true
          this.$store.commit('ID_CARD_VALID')
        })
      } else {
        this.showError = true
        this.type = 'error'
        this.errorMessage = '身份信息不完整,请重新上传'
      }
    },
    handleNewImage (val) {
      var imageBase64 = (val == 1) ? encodeURI(this.idCard1.generateDataUrl('image/jpeg')) : encodeURI(this.idCard2.generateDataUrl('image/jpeg'))

      this.idCardOCR({
        img: imageBase64
      }).then(res => {
        console.log('idCardOCR then', res)
        if (val == 1) {
          this.idCardF = res.data.Data.idCard
        } else {
          this.idCardB = res.data.Data.idCard
        }
      }).catch(res => {
        console.log('idCardOCR catch', res)
        this.showError = true
        this.errorMessage = res.Error.Err
      })
    }
  },
  created () {

  }

}
</script>

