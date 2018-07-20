<template>
    <v-app>
        <v-container fluid>
            <v-layout row justify-center align-center>
                <v-flex md8 xs12>
                    <v-card>
                        <v-layout row  wrap justify-center align-center>
                            <v-flex xs12>
                                <v-avatar size="100">
                                    <img :src="user.avatar+'?'+Number(new Date())">
                                </v-avatar>
                            </v-flex>
                            <v-flex>
                                <v-subheader>{{user.nickName}}</v-subheader>
                                <v-icon v-if="user.idCard.gender == '男' ">man</v-icon>
                                    </v-flex>
                            <v-flex xs12><v-chip label :color="user.idCard.gender?'teal':'grey'" class="white--text">实名认证<v-icon small color="white">add</v-icon></v-chip></v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>

        </v-container>
    </v-app>
</template>
<script>
export default {
  data() {
    return {
      user: {
        idCard: {}
      }
    };
  },
  created() {
    this.$http.get("/profile/" + this.$route.params.id).then(res => {
      if (res.data.Status) {
        this.user = res.data.Data;
      }
    });
  }
};
</script>
