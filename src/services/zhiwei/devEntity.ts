// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 新增或更新业务实体 POST /dev_entity */
export async function saveDevEntity(body: API.DevEntityDTO, options?: { [key: string]: any }) {
  return request<API.RLong>(`/api/dev_entity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 批量删除业务实体 DELETE /dev_entity */
export async function deleteDevEntities(body: number[], options?: { [key: string]: any }) {
  return request<API.RBoolean>(`/api/dev_entity`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 业务实体详情 GET /dev_entity/${param0} */
export async function devEntityDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.devEntityDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RDevEntityVO>(`/api/dev_entity/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 单个删除业务实体 DELETE /dev_entity/${param0} */
export async function deleteDevEntity(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteDevEntityParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.RBoolean>(`/api/dev_entity/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 查询所有业务实体 GET /dev_entity/list */
export async function devEntityList(options?: { [key: string]: any }) {
  return request<API.RListDevEntityVO>(`/api/dev_entity/list`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 分页查询业务实体 GET /dev_entity/page */
export async function devEntityPage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.devEntityPageParams,
  options?: { [key: string]: any },
) {
  return request<API.PListDevEntityVO>(`/api/dev_entity/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 保存业务实体属性 POST /dev_entity/save_property */
export async function saveDevEntityProperty(
  body: API.SaveDevEntityPropertiesDTO,
  options?: { [key: string]: any },
) {
  return request<API.RBoolean>(`/api/dev_entity/save_property`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
