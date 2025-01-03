// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新部门 POST /department */
export async function saveDepartment(body: API.DepartmentDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/department`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除机构部门 DELETE /department */
export async function deleteDepartments(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/department`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 机构部门详情 GET /department/${param0} */
export async function departmentDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.departmentDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RDepartmentVO>(`/api/department/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除机构部门 DELETE /department/${param0} */
export async function deleteDepartment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDepartmentParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/department/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询部门 GET /department/list */
export async function departmentList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.departmentListParams,
  options?: { [key: string]: any },
) {
  return request<API.RListDepartmentVO>(`/api/department/list`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 机构部门目录树 GET /department/tree */
export async function departmentTree(options?: { [key: string]: any }) {
  return request<API.DepartmentTreeVO[]>(`/api/department/tree`, {
    method: 'GET',
    ...(options || {}),
  });
}
