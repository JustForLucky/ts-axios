import axios, { AxiosRequestConfig, AxiosResponse } from '../src/index'
import { getAjaxRequest } from './helper'

describe('interceptors', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })
  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a request interceptor', () => {
    const instance = axios.create()
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      config.headers.test = 'added by interceptor'
      return config
    })

    instance('/foo')

    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test).toBe('added by interceptor')
    })
  })

  test('should add a request interceptor that returns a new config object', () => {
    const instance = axios.create()
    instance.interceptors.request.use(() => ({
      url: '/bar',
      method: 'post'
    }))
    instance('/foo')
    return getAjaxRequest().then(request => {
      expect(request.url).toBe('/bar')
      expect(request.method).toBe('POST')
    })
  })

  test('should add a request interceptor that returns a promise', done => {
    const instance = axios.create()
    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return new Promise(resolve => {
        setTimeout(() => {
          config.headers.async = 'promise'
          resolve(config)
        }, 10)
      })
    })
    instance('/foo')

    setTimeout(() => {
      getAjaxRequest().then(request => {
        expect(request.requestHeaders.async).toBe('promise')
        done()
      })
    }, 100)
  })

  test('should add multiple request interceptors', () => {
    const instance = axios.create()
    instance.interceptors.request.use(config => {
      config.headers.test1 = 'test1'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test2 = 'test2'
      return config
    })
    instance.interceptors.request.use(config => {
      config.headers.test3 = 'test3'
      return config
    })
    instance('/foo')
    return getAjaxRequest().then(request => {
      expect(request.requestHeaders.test1).toBe('test1')
      expect(request.requestHeaders.test2).toBe('test2')
      expect(request.requestHeaders.test3).toBe('test3')
    })
  })

  test('should add a response interceptor', done => {
    let response: AxiosResponse
    const instance = axios.create()
    instance.interceptors.response.use(data => {
      data.data = data.data + ' - modified by interceptor'
      return data
    })

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('OK - modified by interceptor')
        done()
      }, 100)
    })
  })

  test('should add a response interceptor that returns a new data object', done => {
    let response: AxiosResponse
    const instance = axios.create()
    instance.interceptors.response.use(() => ({
      data: 'stuff',
      headers: null,
      status: 500,
      statusText: 'ERR',
      request: null,
      config: {}
    }))

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('stuff')
        expect(response.headers).toBeNull()
        expect(response.statusText).toBe('ERR')
        expect(response.status).toBe(500)
        expect(response.request).toBeNull
        expect(response.config).toEqual({})
        done()
      }, 100)
    })
  })
  test('should add a response interceptor that returns a promise', done => {
    let response: AxiosResponse
    const instance = axios.create()
    instance.interceptors.response.use(
      data =>
        new Promise(resolve => {
          setTimeout(() => {
            data.data = 'you have been promised!'
            resolve(data)
          }, 10)
        })
    )

    instance('/foo').then(data => {
      response = data
    })

    getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })

      setTimeout(() => {
        expect(response.data).toBe('you have been promised!')
        done()
      }, 100)
    })
  })

  test('should add multiple response interceptors', done => {
    let response: AxiosResponse
    const instance = axios.create()
    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })
    instance('/foo').then(data => {
      response = data
    })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
      setTimeout(() => {
        expect(response.data).toBe('OK123')
        done()
      }, 100)
    })
  })

  test('should allow removing interceptors', done => {
    let response: AxiosResponse
    let intercept
    const instance = axios.create()
    instance.interceptors.response.use(data => {
      data.data = data.data + '1'
      return data
    })
    intercept = instance.interceptors.response.use(data => {
      data.data = data.data + '2'
      return data
    })
    instance.interceptors.response.use(data => {
      data.data = data.data + '3'
      return data
    })
    instance.interceptors.response.eject(intercept)
    instance.interceptors.response.eject(5)
    instance('/foo').then(data => {
      response = data
    })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: 'OK'
      })
      setTimeout(() => {
        expect(response.data).toBe('OK13')
        done()
      }, 100)
    })
  })
})
