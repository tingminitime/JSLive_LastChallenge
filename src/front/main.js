// ----- Module -----
import { swal } from '../vendor/swal.js'
import { CLI_apiRequest } from '../api.js'

// ----- DOM -----
const prodSelect = document.querySelector('.prods__select')
const prodsList = document.querySelector('.prods__list')
const cartList = document.querySelector('.cart__list')
const cartTotalAmount = document.querySelector('.cart__total .amount')
const clearCartBtn = document.querySelector('.cart__clearCart')
const noImageUrl = 'img/noimage.png'

// ----- Variable -----
let prodsData = []
let cartData = {}

// ----- 初始化 -----
cartTask()
prodsTask()

// 商品篩選 Option 渲染
function RENDER_prodSelect(data) {
  const selectBasicHTML = /* html */`
  <option
    value="商品篩選"
    selected
    disabled
    hidden
  >商品篩選</option>
  <option value="全部">全部</option>
  `
  const selectHTML = data.reduce((html, item) => {
    html += /* html */`
    <option value="${item}">${item}</option>
    `
    return html
  }, ``)
  prodSelect.innerHTML = selectBasicHTML + selectHTML
}

// 商品篩選 Option 資料
function prodSelectFilter(data) {
  const categories = data.map(item => item['category'])
  RENDER_prodSelect([...new Set(categories)])
}

// 篩品篩選後渲染
function prodsFilter(e) {
  console.log(this.value)
  if (this.value === '全部') RENDER_prods(prodsData)
  else {
    const filterData = prodsData.filter(item => item['category'] === this.value)
    RENDER_prods(filterData)
  }
}

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

// API - 產品列表 Task
async function prodsTask() {
  try {
    const { GET_products } = CLI_apiRequest()
    const prodsDataRes = await GET_products()
    prodsData = prodsDataRes.data.products
    console.log('prodsData: ', prodsData)
    prodSelectFilter(prodsData)
    RENDER_prods(prodsData)
  }
  catch (err) {
    throw err
  }
}

// 購物車無產品
function emptyCart() {
  const emptyCartHTML = /* html */`
    <li class="cart__item">
      <div class="cart__emptyText">購物車裡面沒有東西唷 (*・ω・)ﾉ</div>
    </li>
  `
  // 清除購物車按鈕 Disabled
  clearCartBtn.setAttribute('disabled', '')

  return emptyCartHTML
}

// 渲染購物車
function RENDER_cart(data) {
  if (data.carts.length !== 0) {
    // 移除清除購物車按鈕 Disabled
    clearCartBtn.removeAttribute('disabled')
    // 渲染購物車列表 HTML
    const cartHTML = data.carts.reduce((html, item) => {
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
  else {
    cartList.innerHTML = emptyCart()
  }
  cartTotalAmount.textContent = `${data.finalTotal.toLocaleString()}`
}

// API - 購物車 Task
async function cartTask() {
  try {
    const { GET_carts } = CLI_apiRequest()
    const cartDataRes = await GET_carts()
    cartData = cartDataRes.data
    RENDER_cart(cartData)
    console.log('cartData: ', cartData)
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
    const { POST_carts } = CLI_apiRequest()
    const { success_toast } = swal()

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
    RENDER_cart(cartData)
    console.log('(新增至購物車成功)cartData: ', cartData)
    // Swal
    success_toast('已加入購物車')
  }
  catch (err) {
    throw err
  }
}

// 更新購物車產品數量
function updateCount(e) {
  if (!e.target.closest('.cart__prodCount-control')) return
  const controlBtn = e.target.closest('.cart__prodCount-control')
  const { id, value } = controlBtn.dataset
  updateCountTask(id, value)
}

// API - 更新購物車產品數量 Task
async function updateCountTask(cartId, value) {
  try {
    const { PATCH_carts } = CLI_apiRequest()
    const { confirm_deleteCartProd, success_toast } = swal()
    const target = cartData.carts.find(item => item['id'] === cartId)

    let obj = {
      "data": {
        "id": cartId,
        "quantity": target['quantity'] += parseInt(value)
      }
    }

    // 數量等於 1 又減數量時
    if (obj['data']['quantity'] < 1) {
      confirm_deleteCartProd({
        fn: deleteCartProdTask,
        arg: cartId,
        text: '確定移除此商品 ?'
      })
    }
    // 數量大於 1 減數量
    else if (obj['data']['quantity'] >= 1) {
      const updateCartDataRes = await PATCH_carts(obj)
      cartData = updateCartDataRes.data
      RENDER_cart(cartData)
      console.log('(更新數量成功)cartData: ', cartData)
      success_toast('更新數量成功')
    }
  }
  catch (err) {
    throw err
  }
}

// 刪除購物車產品
function deleteCartProd(e) {
  const { confirm_deleteCartProd } = swal()

  if (!e.target.closest('.cart__delete')) return
  const deleteBtn = e.target.closest('.cart__delete')
  confirm_deleteCartProd({
    fn: deleteCartProdTask,
    arg: deleteBtn.dataset.id,
    text: '確定移除此商品 ?'
  })
}

// API - 刪除購物車產品 Task
async function deleteCartProdTask(cartId) {
  try {
    const { DELETE_cartsProd } = CLI_apiRequest()
    const { success_toast } = swal()
    const deleteCartProdRes = await DELETE_cartsProd(cartId)
    cartData = deleteCartProdRes.data
    RENDER_cart(cartData)
    console.log('(刪除購物車產品成功)cartData: ', cartData)
    // Swal
    success_toast('刪除成功')
  }
  catch (err) {
    throw err
  }
}

// 清除購物車
function clearCart(e) {
  const { confirm_deleteCartProd } = swal()
  confirm_deleteCartProd(clearCartTask)
  confirm_deleteCartProd({
    fn: clearCartTask,
    text: '確定清空購物車 ?'
  })

  // const clearCartConfirm = confirm('確定清除購物車 ?')
  // if (clearCartConfirm) clearCartTask()
  // else return
}

// API - 清除購物車 Task
async function clearCartTask() {
  try {
    const { DELETE_cartsAllProd } = CLI_apiRequest()
    const { success_toast } = swal()
    const clearCartRes = await DELETE_cartsAllProd()
    cartData = clearCartRes.data
    RENDER_cart(cartData)
    console.log('(清除購物車成功)cartData: ', cartData)
    // Swal
    success_toast('購物車已清空')
  }
  catch (err) {
    throw err
  }
}

// ----- Listener -----
prodsList.addEventListener('click', addCart, false)
cartList.addEventListener('click', updateCount, false)
cartList.addEventListener('click', deleteCartProd, false)
clearCartBtn.addEventListener('click', clearCart, false)
prodSelect.addEventListener('change', prodsFilter, false)

// ----- Export -----
export { cartData, cartTask }