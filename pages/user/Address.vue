<template>
    <v-app>
        <v-toolbar>
            <v-btn small outline color="primary" @click="add">新增</v-btn>
        </v-toolbar>
        <v-card>
            <v-radio-group v-model="user.defaultAddress">
               
                <div  v-for="(ads,index) in user.address" :key="ads.id">
                    
        <v-card-text>
             <p>{{ads.userName}}&nbsp;{{ads.phone}}</p>
            <v-layout row wrap>
                <v-flex xs12>
                    <span class="caption">{{ads.province}}{{ads.city}}{{ads.county}}{{ads.street}}</span>
                </v-flex>
                
                <v-flex xs12 >
                    
                    <v-layout row align-center justify-center>
                        <v-flex ><v-radio label="设为默认" small :value="ads.id" @click="setDefaultAddress(ads.id)"></v-radio></v-flex>
                        <v-flex xs5>
                        <v-btn small icon @click="edit(index)" ><v-icon small color="primary">edit</v-icon>编辑</v-btn><v-btn small icon @click="showRemove(index)" ><v-icon small color="warning">delete</v-icon>删除</v-btn>

                        </v-flex>
                    </v-layout>
                 
                </v-flex>
            </v-layout>

        </v-card-text>
        <v-divider></v-divider>
       
</div>
            </v-radio-group>
        </v-card>
        <br>
        <v-card v-if="show">
                    <v-card-text>
        <v-form v-model="valid" ref="form" lazy-validation>

    <v-layout wrap align-center>
        <v-flex xs6 sm6 md6 d-flex>
            <v-text-field label="姓名" :rules="[v => !!v || '不能为空']" v-model="addressData.userName" required prepend-inner-icon="add"></v-text-field>
        </v-flex>
        <v-flex xs6 sm6 md6 d-flex>
            <v-text-field label="电话" :rules="[v => !!v || '不能为空',v => /^[1][3,4,5,7,8][0-9]{9}$/.test(v) || '格式不正确']" v-model="addressData.phone" required prepend-inner-icon="phone"></v-text-field>
        </v-flex>
      <v-flex xs4 sm6 md4 d-flex>

          <v-autocomplete
          v-model="addressData.province"
        :items="provinces"
        item-text="name"
        required
        :rules="[v => !!v || '不能为空']"
        item-value="name"
        persistent-hint
        label="省"
        no-data-text="暂无"
      >
          </v-autocomplete>

      </v-flex>
             <v-flex xs4 sm6 md4 d-flex>
    

                <v-autocomplete
         :items="citys"
          required
          :rules="[v => !!v || '不能为空']"
          item-text="name"
          item-value="name"
          v-model="addressData.city"
          label="城市"
          persistent-hint
          no-data-text="暂无"

      >
          </v-autocomplete>

     </v-flex>
            <v-flex xs4 sm6 md4 d-flex>
        <v-autocomplete
          :items="countys"
          item-text="name"
          required
          :rules="[v => !!v || '不能为空']"
          item-value="name"
          persistent-hint
          v-model="addressData.county"
          label="地区"
          no-data-text="暂无"
        ></v-autocomplete>
      </v-flex>
            <v-flex xs12 sm6 md12 d-flex>
        <v-text-field  required label="详细地址" :rules="[v => !!v || '不能为空']" v-model="addressData.street"></v-text-field>
      </v-flex>
      <v-flex md12 xs12 sm6 d-flex>
            <v-btn outline color="secondary" @click="show = false">取消</v-btn> <v-btn outline color="primary" @click="save">确定</v-btn>
      </v-flex>
   
                   </v-layout>
                        </v-form>
                   </v-card-text>
        </v-card>


              <v-dialog v-model="removedialog" persistent max-width="290">
        <v-card>
          <v-card-title class="subhead ">确定删除该地址?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click.native="removedialog = false">取消</v-btn>
            <v-btn color="warning darken-1" flat @click.native="remove">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


    </v-app>
</template>
<script>
import { provinces, citys, countys } from "~/config/address.js";
export default {
  props: ["user"],
  data() {
    return {
      defaultAddress: 0,
      show: false,
      removedialog: false,
      addressData: {},
      addressIndex: null,
      provinces: provinces
      // citys:citys,
      // countys:countys,
    };
  },
  computed: {
    citys: function() {
      var provinceCode = 0;
      provinces.forEach(element => {
        if (element.name == this.addressData.province) {
          provinceCode = element.code;
        }
      });
      var filterCitys = new Array();
      citys.forEach(element => {
        if (element.parentCode == provinceCode) {
          filterCitys.push(element);
        }
      });
      return filterCitys;
    },
    countys: function() {
      var cityCode = 0;
      var filtercountys = new Array();

      citys.forEach(element => {
        if (element.name == this.addressData.city) {
          cityCode = element.code;
        }
      });
      countys.forEach(element => {
        if (element.parentCode == cityCode) {
          filtercountys.push(element);
        }
      });
      return filtercountys;
    }
  },
  methods: {
    setDefaultAddress(id) {
      this.$http.post("/user/defaultaddress", { id: id }).then(res => {
        if (res.data.Status) {
          this.user.defaultAddress = id;
          this.$store.commit("SUCCESS", "设置默认地址成功");
        } else {
          this.$store.commit("ERROR", res.data.Error.Err);
        }
      });
    },
    add() {
      this.show = true;
      this.addressData = {};
    },
    edit(index) {
      this.addressIndex = index;
      this.addressData = JSON.parse(JSON.stringify(this.user.address[index]));
      this.show = true;
    },
    showRemove(index) {
      this.removedialog = true;
      this.addressIndex = index;
    },
    remove() {
      this.$http
        .delete("/user/address", {
          id: this.user.address[this.addressIndex].id
        })
        .then(res => {
          if (res.data.Status) {
            this.$store.commit("SUCCESS", "删除地址成功");
            this.user.address.splice(this.addressIndex);
            this.removedialog = false;
          } else {
            this.$store.commit("ERROR", res.data);
          }
        });
    },
    save(data) {
      if (this.$refs.form.validate()) {
        if (this.addressData.id) {
          this.$http.put("/user/address", this.addressData).then(res => {
            if (res.data.Status) {
              this.$store.commit("SUCCESS", "修改地址成功");
              this.show = false;
              this.user.address[this.addressIndex] = this.addressData;
            }
          });
        } else {
          this.$http.post("/user/address", this.addressData).then(res => {
            if (res.data.Status) {
              this.$store.commit("SUCCESS", "新增地址成功");
              this.show = false;
              this.user.address.push(res.data.Data);
            }
          });
        }
      }
    }
  },
  created() {}
};
</script>
