// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /generate_code */
export async function generateCode(body: API.GenerateCodeDTO, options?: { [key: string]: any }) {
  return request<API.RObject>(`/api/generate_code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
