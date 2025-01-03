// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前用户信息 GET /auth/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.RAuthUser>(`/api/auth/current`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 账号登录 POST /auth/login */
export async function login(body: API.LoginDTO, options?: { [key: string]: any }) {
  return request<API.RObject>(`/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录 POST /auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.RObject>(`/api/auth/logout`, {
    method: 'POST',
    ...(options || {}),
  });
}
