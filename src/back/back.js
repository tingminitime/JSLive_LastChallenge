// ----- Module -----
import { swal } from '../vendor/swal.js'
import { CLI_apiRequest, ADMIN_apiRequest } from '../api.js'
import { API_getProducts } from '../products.js'
import { C3_sortIncRender, C3_allProdsIncRender } from './chart.js'

// ----- DOM -----
const orderList = document.querySelector('.order__list')
const clearOrdersBtn = document.querySelector('.order__clearAll')

// ----- Variable -----
let ordersData = []
let prodsData = []
let categories = ['床架', '窗簾', '收納']
let colors = {
  top1: '#5434A7',
  top2: '#9D7FEA',
  top3: '#DACBFF',
  other: '#301E5F'
}
const C3_topCount = 3
const C3_otherText = '其他'

// ----- 初始化 -----
renderOrdersTask()

// C3 - 全類別營收比重
function C3_sortIncTask(data) {
  const C3_data = categories.reduce((ary, sort) => {
    const sortIncAcc = data.reduce((accInc, order) => {
      const orderSortIncAcc = order['products'].reduce((acc, prod) => {
        if (prod['category'] === sort) {
          acc += prod['price'] * prod['quantity']
        }
        return acc
      }, 0)
      return accInc + orderSortIncAcc
    }, 0)
    ary.push([sort, sortIncAcc])
    return ary
  }, [])
  console.log('C3_sortInc: ', C3_data)

  return {
    data: C3_data,
    colors: C3_sortIncColors(categories)
  }
}

// C3 - 產品類別顏色
function C3_sortIncColors(categories) {
  let colorsObj = {}
  categories.forEach(item => {
    switch (item) {
      case '窗簾':
        colorsObj[item] = '#5434A7'
        break
      case '收納':
        colorsObj[item] = '#9D7FEA'
        break
      case '床架':
        colorsObj[item] = '#DACBFF'
        break
      default:
        return
    }
  })
  console.log(colorsObj)
  return colorsObj
}

// C3 - 全品項營收比重
async function C3_prodsIncTask(data) {
  try {
    prodsData = await API_getProducts()
    console.log('prodsData: ', prodsData)
    const products = prodsData.map(item => item['title'])
    console.log(products)
    const C3_data = products.reduce((ary, item) => {
      const prodsIncAcc = data.reduce((accInc, order) => {
        const orderProdsIncAcc = order['products'].reduce((acc, prod) => {
          if (prod['title'] === item) {
            acc += prod['price'] * prod['quantity']
          }
          return acc
        }, 0)
        return accInc + orderProdsIncAcc
      }, 0)
      ary.push([item, prodsIncAcc])
      return ary
    }, [])

    const C3_filterData = C3_filterTopData({
      data: C3_data,
      C3_topCount,
      C3_otherText
    })

    const C3_colorsData = C3_prodsIncColors({
      data: C3_filterData,
      C3_topCount,
      C3_otherText
    })

    return { C3_filterData, C3_colorsData }
  }
  catch (err) {
    throw err
  }
}

// C3 - 全品項營收取前幾名及其他資料
function C3_filterTopData(obj) {
  const { data, C3_topCount, C3_otherText } = obj
  // 去除收入為 0 的品項
  const filterData = data.filter(item => item[1] !== 0)
  // 依照金額 大 → 小 排序
  const sortData = filterData.sort((a, b) => b[1] - a[1])
  // 取出 C3_topCount 筆後的其他品項資料，並加總金額組合資料
  const otherData = sortData.slice(C3_topCount).reduce((ary, item) => {
    let acc = 0
    acc += item[1]
    return [C3_otherText, acc]
  }, [])
  // 取出前 C3_topCount 筆資料
  const topData = sortData.slice(0, C3_topCount)
  topData.push(otherData)
  console.log('C3_prodsInc: ', topData)
  return topData
}

// C3 - 全品項營收顏色處理
function C3_prodsIncColors(obj) {
  const { data, C3_topCount, C3_otherText } = obj
  const C3_colorsProps = data.map(item => item[0])
  // 取出顏色物件屬性陣列
  const colorsProps = Object.keys(colors)
  // 取出顏色物件屬性陣列前 C3_topCount // 3
  const colorsTopProps = colorsProps.slice(0, C3_topCount)
  // 取出顏色物件屬性陣列最後一個 // other
  const colorsOtherProps = colorsProps.pop()
  // 組合顏色物件
  const C3_colorsObj = C3_colorsProps.reduce((obj, item, index) => {
    item === C3_otherText || index >= colorsTopProps.length
      ? obj[item] = colors[colorsOtherProps]
      : obj[item] = colors[colorsTopProps[index]]
    return obj
  }, {})
  console.log('C3_colorsObj: ', C3_colorsObj)
  return C3_colorsObj
}

// 渲染訂單列表
async function RENDER_orders(data) {
  try {
    const ordersHTML = data.reduce((html, item) => {
      html += /* html */`
      <tr>
        <td class="order__sn">${item['createdAt']}</td>
        <td>
          <p class="order__clientName">${item['user']['name']}</p>
          <p class="order__clientPhone">${item['user']['tel']}</p>
        </td>
        <td class="order__shippingAddress">${item['user']['address']}</td>
        <td class="order__clientMail">
          <a href="mailto:${item['user']['email']}">${item['user']['email']}</a>
        </td>
        <td class="order__prod">${orderProds(item['products'])}</td>
        <td class="order__date text-center">${parseDate(item['createdAt'] * 1000)}</td>
        <td class="text-center">
          ${orderStatus(item['paid'], item['id'])}
        </td>
        <td class="text-center">
          <button class="order__delete" data-id="${item['id']}">刪除</button>
        </td>
      </tr>
      `
      return html
    }, ``)
    orderList.innerHTML = ordersHTML
    // 全產品類別營收比重
    C3_sortIncRender(C3_sortIncTask(ordersData))
    // 全品項營收比重
    C3_allProdsIncRender(await C3_prodsIncTask(ordersData))
  }
  catch (err) {
    throw err
  }
}

// API - 訂單列表 Task
async function renderOrdersTask() {
  try {
    const { GET_orders } = ADMIN_apiRequest()
    const ordersDataRes = await GET_orders()
    ordersData = ordersDataRes.data.orders
    console.log(ordersData)
    RENDER_orders(ordersData)
  }
  catch (err) {
    throw err
  }
}

// 訂單狀態切換
function orderStatusChange(e) {
  if (!e.target.classList.contains('order__status')) return
  let { status, id } = e.target.dataset
  status = Boolean(Number(e.target.dataset.status))
  orderStatusChangeTask(status, id)
}

// 訂單品項文字處理
function orderProds(prods) {
  const text = prods.reduce((str, prod) => {
    str += `${prod['title']} x ${prod['quantity']}<br>`
    return str
  }, ``)
  return text
}

// 訂單日期處理
function parseDate(timestamp) {
  let orderDate = new Date(parseInt(timestamp))
  const year = orderDate.getFullYear().toString()
  const month = (orderDate.getMonth() + 1).toString()
  const day = orderDate.getDate().toString()
  return `${year}/${month}/${day}`
}

// 訂單狀態處理產生 HTML
function orderStatus(status, id) {
  let html = ``
  status
    ? html = `
    <a class="order__status" href="javascript:;" data-status="0" data-id="${id}">未處理</a>
    `
    : html = `
    <a class="order__status order__status-done" href="javascript:;" data-status="1" data-id="${id}">已處理</a>
    `
  return html
}

// API - 訂單狀態切換 Task
async function orderStatusChangeTask(status, id) {
  try {
    const { PUT_orderStatusChange } = ADMIN_apiRequest()
    const { success_orderToast } = swal()
    const targetOrder = ordersData.find(item => item['id'] === id)
    const orderStatusChangeRes = await PUT_orderStatusChange({
      "data": {
        "id": id,
        "paid": status
      }
    })
    ordersData = orderStatusChangeRes.data.orders
    RENDER_orders(ordersData)
    success_orderToast('訂單狀態已更新', targetOrder['createdAt'])
  }
  catch (err) {
    throw err
  }
}

// 刪除一筆訂單
function orderDelete(e) {
  if (!e.target.classList.contains('order__delete')) return
  const { confirm_alert } = swal()
  const id = e.target.dataset.id
  confirm_alert({
    fn: orderDeleteTask,
    arg: id,
    text: '確定刪除此筆訂單 ?'
  })

}

// API - 刪除一筆訂單 Task
async function orderDeleteTask(id) {
  try {
    const { DELETE_order } = ADMIN_apiRequest()
    const { success_orderToast } = swal()
    const orderDeleteRes = await DELETE_order(id)
    const targetOrder = ordersData.find(item => item['id'] === id)
    ordersData = orderDeleteRes.data.orders
    RENDER_orders(ordersData)
    success_orderToast('已刪除一筆訂單', targetOrder['createdAt'])
  }
  catch (err) {
    throw err
  }
}

// 清空全部訂單
function clearAllOrders(e) {
  const { DELETE_allOrders } = ADMIN_apiRequest()
  const { confirm_alert, success_clearOrders } = swal()
  confirm_alert({
    fn: async function () {
      try {
        const clearAllOrdersRes = await DELETE_allOrders()
        ordersData = clearAllOrdersRes.data.orders
        RENDER_orders(ordersData)
        success_clearOrders()
      }
      catch (err) {
        throw err
      }
    },
    text: '是否清空所有訂單 ?'
  })
}

// ----- Listener -----
orderList.addEventListener('click', orderStatusChange, false)
orderList.addEventListener('click', orderDelete, false)
clearOrdersBtn.addEventListener('click', clearAllOrders, false)