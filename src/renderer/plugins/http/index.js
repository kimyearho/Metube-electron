import axios from "axios-jsonp-pro"

/* global loading */
import NProgress from "nprogress"
import "nprogress/nprogress.css"
NProgress.configure({ showSpinner: false })

const service = axios.create({
  timeout: 5000,
  headers: {
    'Accept-Version': 1,
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  }
})

/* Request interceptors */
service.interceptors.request.use(
  function(config) {
    NProgress.start()
    return config
  },
  function(error) {
    console.log('11 : ' + error)
    return Promise.reject(error)
  }
)

/* Response interceptors */
service.interceptors.response.use(
  function(response) {
    NProgress.done()
    return response
  },
  function(error) {
    console.log('22 : ' + error)
    return Promise.reject(error)
  }
)

export default service
