// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新生成代码示例1 POST /demo */
export async function saveDemo(body: API.DemoDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/demo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除生成代码示例1 DELETE /demo */
export async function deleteDemos(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/demo`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 生成代码示例1详情 GET /demo/${param0} */
export async function demoDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.demoDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RDemoVO>(`/api/demo/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除生成代码示例1 DELETE /demo/${param0} */
export async function deleteDemo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDemoParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/demo/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有生成代码示例1 GET /demo/list */
export async function demoList(options?: { [key: string]: any }) {
  return request<API.RListDemoVO>(`/api/demo/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询生成代码示例1 GET /demo/page */
export async function demoPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.demoPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListDemoVO>(`/api/demo/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
