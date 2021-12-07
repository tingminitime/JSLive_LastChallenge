// ----- Module -----
import { swal } from '../vendor/swal.js'
import { ADMIN_apiRequest } from '../api.js'

// ----- DOM -----
const orderList = document.querySelector('.order__list')
const clearOrdersBtn = document.querySelector('.order__clearAll')

// ----- Variable -----
let ordersData = []

// ----- 初始化 -----
renderOrdersTask()

// 訂單品項文字處理
function orderProds(prods) {
  const text = prods.reduce((str, prod) => {
    str += `${prod['title']} x ${prod['quantity']}`
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
    const { success_orderStatusChange } = swal()
    const targetOrder = ordersData.find(item => item['id'] === id)
    const orderStatusChangeRes = await PUT_orderStatusChange({
      "data": {
        "id": id,
        "paid": status
      }
    })
    ordersData = orderStatusChangeRes.data.orders
    RENDER_orders(ordersData)
    success_orderStatusChange(targetOrder['createdAt'])
  }
  catch (err) {
    throw err
  }
}

// 刪除一筆訂單
function orderDelete(e) {
  if (!e.target.classList.contains('order__delete')) return
  const id = e.target.dataset.id

}

// API - 刪除一筆訂單 Task
async function orderDeleteTask(id) {
  try {
    const { DELETE_order } = ADMIN_apiRequest()
    const { success_clearOrders } = swal()
    const orderDeleteRes = await DELETE_order(id)
    ordersData = orderDeleteRes.data.orders

  }
  catch (err) {
    throw err
  }
}

// 清空全部訂單
function clearAllOrders(e) {

}

// ----- Listener -----
orderList.addEventListener('click', orderStatusChange, false)
orderList.addEventListener('click', orderDelete, false)
clearOrdersBtn.addEventListener('click', clearAllOrders, false)