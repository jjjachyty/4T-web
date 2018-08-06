<template>
<v-container>
                            <v-layout row justify-space-between align-center>
                            <v-flex xs2 md2>
                                <v-avatar size="30">
                                    <img :src="avatarRoot+order.buyer.id">
                                </v-avatar><small>{{order.buyer.name}}</small><v-icon small>keyboard_arrow_right</v-icon>
                            </v-flex>
                            <v-flex  xs4 md3>
                                <span class=" font-weight-bold">
                                    <span class=" deep-orange--text"> ¥{{order.strikePrice}}</span>
                                </span>/
                                <small class=" deep-orange--text">代费¥{{order.charge}}</small>
                            </v-flex>
                            <v-flex xs2 md2>
                                <small class="caption red--text font-weight-bold">{{order.state | dict('orderState')}}</small>
                            </v-flex>
                        </v-layout>
                      </v-container>
</template>
<script>
export default {
  props: ["order"]
};
</script>
