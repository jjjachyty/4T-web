import Qs from 'qs'
import axios from 'axios'
import Vue from 'vue'
import * as types from '~/store/mutation-types.js'
import {
  apiRoot
} from '~/config'

import moment from 'moment'

moment.locale()
export default (context) => {
  // axios 配置
  axios.defaults.timeout = 5000
  axios.defaults.baseURL = apiRoot

  // http request 拦截器
  axios.interceptors.request.use(
    config => {
      if (context.store.state.auth.token !== '') {
        config.headers.Authorization = `Bearer ${context.store.state.auth.token}`
      }
      if (config.url !== '/user/refreshtoken') {
        console.log('config', config.url, config.url.indexOf('/user') !== -1, context.store.state.auth.token === '')
        if (config.url.indexOf('/user') !== -1) { // 用户操作 需要登陆
          // 判断token是否过期
          if (context.store.state.auth.expire !== '') {
            var expireTime = moment(context.store.state.auth.expire, 'YYYY-MM-DD HH:mm:ss').toDate()
            var nowTime = new Date()
            console.log('过期时间', expireTime, '当前时间', nowTime, expireTime.getTime() - nowTime.getTime())
            if (expireTime.getTime() - nowTime.getTime() < 600000) { // 剩余10分钟 则重新获取token
              // 重新请求token
              axios.get('/user/refreshtoken', {}).then(res => {
                console.log('refreshtoken', res)
                if (res.status === 200) {
                  context.store.commit('LOGIN_SUCCESS', res.data)
                  return config
                }
              }).catch(res => {
                return Promise.reject(res.error)
              })
            }
          }
        }
      }
      return config
    },
    err => {
      return Promise.reject(err)
    })

  // http response 拦截器
  axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      console.log('error.response--------', error.response)

      if (error && error.response) {
        switch (error.response.status) {
          case 401:
            console.log(this.$router)
            if (error.response.data.message.indexOf('expired') !== -1) {
              // 401 清除token信息并跳转到登录页面
              context.store.commit(types.LOGOUT)
              context.store.commit('INFO', '登陆状态已过期，请重新登陆')

              this.$router.replace({
                name: 'login',
                query: {
                  redirect: this.$router.currentRoute.fullPath
                }
              })
            } else {
              context.store.commit('ERROR', '用户名或密码错误')
            }
            break
          case 400:
            context.store.commit('ERROR', '表单数据错误,请检查表单数据')
            break
          case 0:
            context.store.commit('INFO', '请先登陆')
            this.$router.replace({
              name: 'login',
              query: {
                redirect: this.$router.currentRoute.fullPath
              }
            })
            break
          default:
            context.store.commit('ERROR', error)
        }
      }
      // context.store.commit('ERROR', "系统错误,请稍后再试")
      // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
      return Promise.reject(error)
    }
  )
  var $http = {
    get (url, params) {
      console.log('get--params', params)
      return axios.get(url, {
        params: params
      })
    },
    post (url, params) {
      return axios.post(url, Qs.stringify(params, {
        arrayFormat: 'brackets'
      }))
    },
    postJson (url, params) {
      return axios.post(url, JSON.stringify(params))
    },
    putJson (url, params) {
      return axios.put(url, JSON.stringify(params))
    },
    put (url, params) {
      return axios.put(url, Qs.stringify(params, {
        arrayFormat: 'brackets'
      }))
    },
    delete (url, params) {
      console.log('delete-----', url, params)
      return axios.delete(url, {
        params: params
      })
    }
  }
  context.$http = $http

  Vue.prototype.$http = $http
  // Vue.use(vue$http)
}
