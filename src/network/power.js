import {request} from './request'
export function getRightsList(type) {
  return request({
    url: `/rights/${type}`,
    methord: 'get'
  })
}
export function getRolesList() {
  return request({
    url: '/roles',
    methord: 'get'
  })
}
export function removeRoles(roleId,rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete',
  })
}
export function updateRoles(roleId,data) {
  return request({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data
  })
}
export function allotRoles(id,data) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data
  })
}
export function addRoles(data) {
  return request({
    url: `/roles`,
    method: 'post',
    data
  })
}
export function editRoles(id,data) {
  return request({
    url: `roles/${id}`,
    method: 'put',
    data
  })
}
export function deleteRoles(id) {
  return request({
    url: `roles/${id}`,
    method: 'delete',
  })
}

