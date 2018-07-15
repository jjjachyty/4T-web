import Vue from 'vue'
import moment from 'moment'
moment.locale()
const rechargeType = {
  0: '银行转账',
  1: '微信',
  2: '支付宝'
}
const purchaseState = {
  0: '待接单',
  1: '待支付',
  2: '已确认',
  3: '已购买',
  4: '已发货'
}
const reasonType = {
  '0': '代购费高',
  '1': '商品价格高',
  '2': '渠道非正品',
  '3': '发货时间长',
  '4': '其他'
}
const quotationType = {
  '0': '被拒绝',
  '-1': '失效',
  '1': '待支付'
}
const orderState = {
  0: '待付款',
  1: '待购买',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '售后/维权'
}

export function dict (value, key) {
  console.log('dict', key, value)
  switch (key) {
    case 'rechargeType':
      console.log('rechargeType', value, key)
      return rechargeType[value]
    case 'purchaseState':
      console.log('purchaseState', value, key)
      return purchaseState[value]
    case 'reasonType':
      console.log('reasonType', value, key)
      return reasonType[value]
    case 'quotationType':
      console.log('quotationType', value, key)
      return quotationType[value]
    case 'orderState':
      console.log('orderState', value, key)
      return orderState[value]
    default:
      break
  }
}
export function formatDate (value, key) {
  return moment(value).format(key)
}

export function formatContent (value, key) {
  return value.substr(0, 100)
}

const filters = {
  formatContent,
  formatDate,
  dict
}
export default filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
