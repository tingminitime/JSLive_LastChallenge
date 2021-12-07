// ----- Module -----
import { loadingHandler, blockLoading, fixedLoading } from './loading.js'

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

  return {
    GET_orders
  }
}

// ----- Request 攔截器 -----
apiRequest.interceptors.request.use(
  (config) => {
    loadingHandler(config)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

// ----- Response 攔截器 -----
apiRequest.interceptors.response.use(
  (res) => {
    loadingHandler(res.config)
    return res
  },
  (err) => {
    return Promise.reject(err)
  }
)