// ----- Module -----
import { CLI_apiRequest } from '../api.js'

// ----- DOM -----
const prodsList = document.querySelector('.prods__list')
const cartList = document.querySelector('.cart__list')
const cartTotalAmount = document.querySelector('.cart__total .amount')
const noImageUrl = 'img/noimage.png'

// ----- Variable -----
let prodsData = []
let cartData = {}

// 渲染產品列表
function RENDER_prods(data) {
  const prodsHTML = data.reduce((html, item) => {
    html += /* html */`
    <li class="prods__item">
      <a
        href="javascript:;"
        class="prods__img"
      >
        <div class="prods__newTag">新品</div>
        <div class="prods__imgWrap">
          <img
            src=${item['images'] ?? noImageUrl}
            alt="product picture"
          >
        </div>
      </a>
      <a
        href="javascript:;"
        class="prods__addCart"
        data-id=${item['id']}
      >加入購物車</a>
      <div class="prods__info">
        <h3 class="prods__title">${item['title']}</h3>
        <p class="prods__origPrice">
          <span class="unit">NT$ </span>
          <span class="amount">${item['origin_price'].toLocaleString()}</span>
        </p>
        <p class="prods__onsalePrice">
          <span class="unit">NT$ </span>
          <span class="amount">${item['price'].toLocaleString()}</span>
        </p>
      </div>
    </li>
    `
    return html
  }, ``)
  prodsList.innerHTML = prodsHTML
}

// 渲染購物車
function RENDER_cart(data) {
  const cartHTML = data.reduce((html, item) => {
    html += /* html */`
    <li class="cart__item flex-start-center">
      <div class="cart__prodInfo flex-start-center">
        <div class="cart__img">
          <img
            src=${item['product']['images'] ?? noImageUrl}
            alt="product picture"
          >
        </div>
        <div class="cart__prodName">${item['product']['title']}</div>
      </div>
      <div class="cart__prodPrice">
        <span class="d-d-n">單價: </span>
        <span class="unit">NT$ </span>
        <span class="amount">${item['product']['price'].toLocaleString()}</span>
      </div>
      <div class="cart__prodCount flex-start-center">
        <span class="d-d-n">數量: </span>
        <div class="flex-center">
          <button class="cart__prodCount-control" data-id="${item['id']}" data-value="-1">
            <i class="material-icons">remove</i>
          </button>
          <span class="cart__count" data-count="${item['quantity']}">${item['quantity']}</span>
          <button class="cart__prodCount-control" data-id="${item['id']}" data-value="1">
            <i class="material-icons">add</i>
          </button>
        </div>
      </div>
      <div class="cart__prodTotal">
        <span class="d-d-n">金額: </span>
        <span class="unit">NT$ </span>
        <span class="amount">${(item['product']['price'] * item['quantity']).toLocaleString()}</span>
      </div>
      <div class="flex-end-center">
        <button class="cart__delete" data-id="${item['id']}">
          <i class="material-icons">close</i>
        </button>
      </div>
    </li>
    `
    return html
  }, ``)
  cartList.innerHTML = cartHTML
}

// API - 產品列表 Task
async function prodsTask() {
  try {
    const { GET_products } = CLI_apiRequest()
    const prodsDataRes = await GET_products()
    prodsData = prodsDataRes.data.products
    console.log('prodsData: ', prodsData)
    RENDER_prods(prodsData)
  }
  catch (err) {
    throw err
  }
}

// API - 購物車 Task
async function cartTask() {
  try {
    const { GET_carts } = CLI_apiRequest()
    const cartDataRes = await GET_carts()
    cartData = cartDataRes.data
    console.log(cartData)
    RENDER_cart(cartData.carts)
    cartTotalAmount.textContent = `${cartData.finalTotal.toLocaleString()}`
  }
  catch (err) {
    throw err
  }
}

// 點擊新增購物車
function addCart(e) {
  if (!e.target.classList.contains('prods__addCart')) return
  addCartTask(e.target.dataset.id)
}

// API - 新增購物車 Task
async function addCartTask(prodId) {
  try {
    console.log(prodId)
    const { POST_carts } = CLI_apiRequest()

    let obj = {
      "data": {
        "productId": prodId,
        "quantity": 1
      }
    }

    cartData.carts.forEach(item => {
      if (item['product']['id'] === prodId) {
        obj['data']['quantity'] += item['quantity']
      }
    })

    const updateCartDataRes = await POST_carts(obj)
    cartData = updateCartDataRes.data
    RENDER_cart(cartData.carts)
    console.log(cartData)
  }
  catch (err) {
    throw err
  }
}

function updateCount(e) {
  if (!e.target.closest('.cart__prodCount-control')) return
  const controlBtn = e.target.closest('.cart__prodCount-control')
  const { id, value } = controlBtn.dataset
  updateCountTask(id, value)
}

async function updateCountTask(cartId, value) {
  try {
    console.log(cartId, value)
    const { PATCH_carts } = CLI_apiRequest()

    function getTargetData(data) {
      const target = data.find(item => item['id'] === cartId)
      console.log(target)
      return {
        "data": {
          "id": cartId,
          "quantity": target['quantity'] + parseInt(value) < 1
            ? target['quantity']
            : target['quantity'] += parseInt(value)
        }
      }
    }

    let obj = getTargetData(cartData.carts)
    console.log(obj)

    const updateCartDataRes = await PATCH_carts(obj)
    cartData = updateCartDataRes.data
    RENDER_cart(cartData.carts)
    console.log(cartData)
  }
  catch (err) {
    throw err
  }
}

// ----- 初始化 -----
cartTask()
prodsTask()

// ----- Listener -----
prodsList.addEventListener('click', addCart, false)
cartList.addEventListener('click', updateCount, false)