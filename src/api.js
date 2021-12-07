// ----- Module -----
import { loadingHandler, fixedLoading } from './loading.js'

// ----- API base -----
const token = 'PXrRfppPR2Uht0dID8L1bdukHMa2'
const path = 'timinitime'

const apiRequest = axios.create({
  baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1'
})

const apiRequestWithToken = axios.create({
  baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1',
  headers: {
    'authorization': token
  }
})

// ----- Client API -----
export const CLI_apiRequest = () => {
  // 取得全部產品
  const GET_products = () => apiRequest.get(`/customer/${path}/products`)
  // 取得購物車資訊
  const GET_carts = () => apiRequest.get(`/customer/${path}/carts`)
  // 新增產品至購物車
  const POST_carts = data => apiRequest.post(`/customer/${path}/carts`, data)
  // 修改購物車產品數量
  const PATCH_carts = data => apiRequest.patch(`/customer/${path}/carts`, data)
  // 刪除購物車產品
  const DELETE_cartsProd = id => apiRequest.delete(`/customer/${path}/carts/${id}`)
  // 清除購物車
  const DELETE_cartsAllProd = () => apiRequest.delete(`/customer/${path}/carts`)
  // 送出訂單
  const POST_order = data => apiRequest.post(`/customer/${path}/orders`, data)

  return {
    GET_products,
    GET_carts,
    POST_carts,
    PATCH_carts,
    DELETE_cartsProd,
    DELETE_cartsAllProd,
    POST_order
  }
}

// ----- Admin API -----
export const ADMIN_apiRequest = () => {
  // 取得訂單資料
  const GET_orders = () => apiRequestWithToken.get(`/admin/${path}/orders`)
  // 訂單狀態切換
  const PUT_orderStatusChange = data => apiRequestWithToken.put(`/admin/${path}/orders`, data)
  // 清空訂單
  const DELETE_allOrders = () => apiRequestWithToken.delete(`/admin/${path}/orders`)
  // 刪除一筆訂單
  const DELETE_order = id => apiRequestWithToken.delete(`/admin/${path}/orders/${id}`)

  return {
    GET_orders,
    PUT_orderStatusChange,
    DELETE_allOrders,
    DELETE_order
  }
}

// ----- apiRequest Request 攔截器 -----
apiRequest.interceptors.request.use(
  (config) => {
    loadingHandler(config)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// ----- apiRequest Response 攔截器 -----
apiRequest.interceptors.response.use(
  (res) => {
    loadingHandler(res.config)
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)

// ----- apiRequestWithToken Request 攔截器 -----
apiRequestWithToken.interceptors.request.use(
  (config) => {
    fixedLoading()
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// ----- apiRequestWithToken Response 攔截器 -----
apiRequestWithToken.interceptors.response.use(
  (res) => {
    fixedLoading()
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)