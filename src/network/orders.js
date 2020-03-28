import {request} from './request'
export function getOrders(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}
export function getLocation() {
  return request({
    url: `/kuaidi/1106975712662`,
    method: 'get',
  })
}
