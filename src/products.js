import { CLI_apiRequest } from './api.js'

export async function API_getProducts() {
  try {
    let prodsData = []
    const { GET_products } = CLI_apiRequest()
    const prodsDataRes = await GET_products()
    prodsData = prodsDataRes.data.products
    // console.log('prodsData: ', prodsData)
    return prodsData
  }
  catch (err) {
    throw err
  }
}