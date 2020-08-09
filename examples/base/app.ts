import axios from '../../src/index'

// const paramsDemos = [
//   { foo: ['bar', 'baz'] },
//   { foo: { bar: 'baz' } },
//   { date: new Date() },
//   { foo: '@:$, ' },
//   { foo: 'bar', baz: null },
//   { url: '/base/get#hash', foo: 'bar' },
//   { url: '/base/get?foo=bar', bar: 'baz' }
// ]

// paramsDemos.filter(({ url = '/base/get', ...params }) => {
//   axios({
//     method: 'get',
//     url,
//     params
//   })
// })

axios({
  method: 'post',
  url: '/base/post',
  data: {
    a: 1,
    b: 2
  }
}).then(res => {
  console.log(res)
})

// const arr = new Int32Array([21, 31])

// axios({
//   method: 'post',
//   url: '/base/buffer',
//   data: arr
// })

// axios({
//   method: 'post',
//   url: '/base/post',
//   headers: {
//     'content-type': 'application/json',
//     'Accept': 'application/json, text/plain, */*'
//   },
//   data: {
//     name: 'lily',
//     age: 28
//   }
// })

// const paramsString = 'q=URLUtils.searchParams&topic=api'
// const searchParams = new URLSearchParams(paramsString)

// axios({
//   method: 'post',
//   url: '/base/post',
//   data: searchParams
// })

axios({
  method: 'post',
  url: '/base/post',
  responseType: 'json',
  data: {
    a: 3,
    b: 4
  }
}).then(res => {
  console.log(res)
})
