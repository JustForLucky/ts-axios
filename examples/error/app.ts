import axios, { AxiosError, AxiosPromise } from '../../src/index'
import { config } from 'process'

axios({
  url: '/error/not_exist'
}).then(res => {
  console.log(res)
}).catch(error => {
  console.log(error)
})

axios({
  url: '/error/get'
}).then(res => {
  console.log(res)
}).catch(error => {
  console.log(error)
})


setTimeout(() => {
  axios({
    url: '/error/get'
  }).then(res => {
    console.log(res)
  }).catch(error => {
    console.log(error)
  })
}, 5000)

axios({
  url: '/error/timeout',
  timeout: 2000
}).then(res => {
  console.log(res)
}).catch((error: AxiosError) => {
  console.log(error.message)
  console.log(error.config)
  console.log(error.code)
})
