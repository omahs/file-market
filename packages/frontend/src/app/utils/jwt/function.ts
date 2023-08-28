import { ErrorResponse, HttpResponse, RequestParams } from '../../../swagger/Api'
import { createToken } from './createToken'
import { getAccessToken } from './get'

export const requestJwtAccess = <Props, Data>(request: (props: Props, params?: RequestParams) => Promise<HttpResponse<Data, ErrorResponse>>, props: Props, params?: RequestParams) => {
  return request(props, {
    ...params,
    headers: { authorization: createToken(getAccessToken()?.token ?? '') },
  })
}
