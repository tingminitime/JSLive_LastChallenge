// ----- Module -----
import { swal } from '../vendor/swal.js'
import { CLI_apiRequest, ADMIN_apiRequest } from '../api.js'
import { C3_sortIncRender, C3_allProdsIncRender } from './chart.js'

// ----- DOM -----
const orderList = document.querySelector('.order__list')
const clearOrdersBtn = document.querySelector('.order__clearAll')

// ----- Variable -----
let ordersData = []
let categories = ['床架', '窗簾', '收納']

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
  console.log('C3_data: ', C3_data)

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

  return {
    data: C3_data,
    colors: colorsObj
  }
}

// C3 - 全品項營收比重
function C3_allProdsIncTask() {

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

// 訂單狀態處理
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

// 渲染訂單列表
function RENDER_orders(data) {
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
  C3_sortIncRender(C3_sortIncTask(ordersData))
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