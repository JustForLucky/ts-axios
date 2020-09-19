import axios from '../src/index'
import mergeConfig from '../src/core/mergeConfig'

describe('mergeConfig', () => {
  const defaults = axios.defaults

  test('should accept undefined for second argument', () => {
    expect(mergeConfig(defaults, undefined)).toEqual(defaults)
  })

  test('should accept an object for second arugment', () => {
    expect(mergeConfig(defaults, {})).toEqual(defaults)
  })

  test('should not leave references', () => {
    const merged = mergeConfig(defaults, {})
    expect(merged).not.toBe(defaults)
    expect(merged.headers).not.toBe(defaults.headers)
  })

  test('should allow setting request options', () => {
    const config = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = mergeConfig(defaults, config)
    expect(merged.url).toBe(config.url)
    expect(merged.params).toBe(config.params)
    expect(merged.data).toEqual(config.data)
  })

  test('should not inherit request options', () => {
    const localConfig = {
      url: '__sample url__',
      params: '__sample params__',
      data: { foo: true }
    }
    const merged = mergeConfig(localConfig, {})
    expect(merged.url).toBeUndefined()
    expect(merged.params).toBeUndefined()
    expect(merged.data).toBeUndefined()
  })

  test('should return default headers if pass config2 with undefined', () => {
    expect(
      mergeConfig(
        {
          headers: 'x-mock-header'
        },
        undefined
      )
    ).toEqual({
      headers: 'x-mock-header'
    })
  })

  test('should merge auth, headers with defaults', () => {
    expect(
      mergeConfig(
        { auth: undefined },
        {
          auth: {
            username: 'foo',
            password: '123456'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'foo',
        password: '123456'
      }
    })
    expect(
      mergeConfig(
        {
          auth: {
            username: 'dudu',
            password: '123456'
          }
        },
        {
          auth: {
            username: 'lili',
            password: '654321'
          }
        }
      )
    ).toEqual({
      auth: {
        username: 'lili',
        password: '654321'
      }
    })
  })

  test('should overwrite auth, headers with a non-object value', () => {
    expect(
      mergeConfig(
        {
          headers: { common: { Accept: 'application/json, text/plain, */*' } }
        },
        { headers: null }
      )
    ).toEqual({
      headers: null
    })
  })

  test('should allow setting other options', () => {
    const merged = mergeConfig(defaults, {
      timeout: 123
    })
    expect(merged.timeout).toBe(123)
  })
})
