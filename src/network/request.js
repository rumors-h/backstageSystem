import axios from 'axios'
export function request(config) {
  const instance = axios.create({
    baseURL : 'http://127.0.0.1:8888/api/private/v1/'
  })

  //设置请求拦截
  instance.interceptors.request.use(config => {
    //发请求之前在headers中加一个Authorization字段（接口说明），提供token令牌，用于验证用户是否登录
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
  })
  return instance(config)
}