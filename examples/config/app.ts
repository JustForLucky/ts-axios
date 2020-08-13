import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

// axios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: qs.stringify({
//     a: 1
//   }),
//   headers: {
//     test: 321
//   }
// }).then(res => {
//   console.log(res)
// })

// axios({
//   transformRequest: [
//     (data, headers) => {
//       headers['X-Test'] = 'x-test'
//       return qs.stringify(data)
//     },
//     ...(axios.defaults.transformRequest as (AxiosTransformer[]))
//   ],
//   transformResponse: [
//     ...(axios.defaults.transformResponse as (AxiosTransformer[])),
//     data => typeof data === 'object' ? { ...data, b: 2 } : data
//   ],
//   url: '/config/post',
//   method: 'post',
//   data: { a: 1 }
// }).then(res => {
//   console.log(res)
// })

const instance = axios.create({
  transformRequest: [
    (data, headers) => {
      headers['X-Test'] = 'x-test'
      return qs.stringify(data)
    },
    ...(axios.defaults.transformRequest as (AxiosTransformer[]))
  ],
  transformResponse: [
    ...(axios.defaults.transformResponse as (AxiosTransformer[])),
    data => typeof data === 'object' ? { ...data, b: 2 } : data
  ]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then(res =>{
  console.log(res);
})
