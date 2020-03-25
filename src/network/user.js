import {request} from './request.js'
export function getUserInfo(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export function changeUserState(id,state) {
  return request({
    url: `users/${id}/state/${state}`,
    method: 'put',
  })
}

export function addUser(data) {
  return request({
    url: 'users',
    method: 'post',
    data
  })
}

export function editUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'get',
  })
}

export function editUserInfo(id,data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete',
  })
}