import {request} from './request'

export function getMenuList() {
  return request({
    method: 'get',
    url: '/menus',
  })
}