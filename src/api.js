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

// -----  -----
export const CLI_apiRequest = () => {
  // 取得全部產品
  const GET_products = path => apiRequest.get(`/customer/${path}/products`)
  // 取得購物車資訊
  const GET_carts = path => apiRequest.get(`/customer/${path}/carts`)

  return { GET_products, GET_carts }
}