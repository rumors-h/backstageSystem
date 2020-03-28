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
/* 商品参数 */
export function getParams(id,params) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'get',
    params
  })
}
export function addParams(id,data) {
  return request({
    url: `categories/${id}/attributes`,
    method: 'post',
    data
  })
}
export function editParams(id,attrId,data) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}
export function deleteParams(id,attrid) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: 'delete',
  })
}
/* 商品列表 */
export function getGoods(params) {
  return request({
    url: `goods`,
    method: 'get',
    params
  })
}
export function addGoods(data) {
  return request({
    url: `goods`,
    method: 'post',
    data
  })
}