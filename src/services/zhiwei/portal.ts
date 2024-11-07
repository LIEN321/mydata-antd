// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 查询当前登录用户的菜单 GET /portal/menus */
export async function portalMenus(options?: { [key: string]: any }) {
  return request<API.RListMenuDataItem>(`/api/portal/menus`, {
    method: 'GET',
    ...(options || {}),
  });
}
