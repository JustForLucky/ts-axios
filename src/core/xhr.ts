import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { isURLSameOrigin } from '../helpers/url'
import Cookie from '../helpers/cookie'
import { isFormData } from '../helpers/utils'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      data = null,
      method,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfHeaderName,
      xsrfCookieName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()
    /** 开启 */
    request.open(method!.toUpperCase(), url!, true)

    /** 配置 */
    configureRequest()
    /** 事件监听 */
    addEvents()
    /** headers处理 */
    processHeaders()
    /** cancel处理 */
    processCancel()

    request.send(data)

    function configureRequest(): void {
      /** 设置 */
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      /** 生命周期监听 */
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) return

        if (request.status === 0) return

        const responseHeaders = request.getAllResponseHeaders()
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: parseHeaders(responseHeaders),
          config,
          request
        }
        // resolve(response)
        handleResponse(response)
      }

      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      request.ontimeout = function handleTimeout() {
        /** ECONNABORTED 远程主机拒绝网络连接 */
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      /** 让浏览器自动设置Content-Type */
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      /** 设置headers */
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = Cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      /** Authorization */
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch(
            /* istanbul ignore next */
            () => {
              // do nothing
            }
          )
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
