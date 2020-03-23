import { request } from './request'
export function Login(data) {
  return request({
    method: 'post',
    url: '/login',
    data
  })
}