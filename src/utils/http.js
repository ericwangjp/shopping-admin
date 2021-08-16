import axios from 'axios'
import {
  BASE_URL
} from '@/utils/consts.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function http(config) {
  const instance = axios.create({
    // baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    // baseURL: 'http://shop.qwq3.top:8889/api/private/v1/',
    baseURL: BASE_URL,
    timeout: 15000
  })

  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    NProgress.start()
    console.log('请求开始==> ', config)
    return config
  }, error => {
    console.log('请求失败==> ', error)
    return Promise.reject(error)
  })

  instance.interceptors.response.use(response => {
    console.log('响应开始==> ', response)
    NProgress.done()
    return response.data
  }, error => {
    console.log('响应失败==> ', error)
    return Promise.reject(error)
  })

  return instance(config)
}
