import {request} from './request'
export function getGoodsList(params) {
  return request({
    url: '/categories',
    method: 'get',
    params
  })
}
export function addCatagory(data) {
  return request({
    url: '/categories',
    method: 'post',
    data
  })
}