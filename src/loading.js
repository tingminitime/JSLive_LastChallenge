const blockLoadingTemplate = `
<li class="loading__item">
  <div class="loading flex-center">
    <img src="img/loading-oval.svg">
  </div>
</li>
`

export function loadingHandler(config) {
  let url = config.url.split('/')
  url.shift() // 去除 "/"
  let urlAry = url.slice(0, 3)
  const method = config.method
  const user = urlAry[0]
  const sort = urlAry[urlAry.length - 1]

  // 前台 Loading
  if (user === 'customer') {
    if (method === 'get' && sort === 'products') {
      const prodsList = document.querySelector('.prods__list')
      prodsList.innerHTML = blockLoadingTemplate
    }
    if (method === 'get' && sort === 'carts') {
      const cartList = document.querySelector('.cart__list')
      cartList.innerHTML = blockLoadingTemplate
    }
    if (method === 'post' && sort === 'carts') {
      const cartList = document.querySelector('.cart__list')
      cartList.innerHTML = blockLoadingTemplate
    }
    if (method === 'patch' && sort === 'carts') {
      fixedLoading()
    }
    if (method === 'delete' && sort === 'carts') {
      fixedLoading()
    }
    if (method === 'post' && sort === 'orders') {
      fixedLoading()
    }
  }
  // 後台 Loading
  else if (user === 'admin') {
    return
  }
}

export function blockLoading(user, sort) {
  if (user === 'customer' && sort === 'products') {
    const prodsList = document.querySelector('.prods__list')
    prodsList.innerHTML = blockLoadingTemplate
  }
  else if (user === 'customer' && sort === 'carts') {
    const cartList = document.querySelector('.cart__list')
    cartList.innerHTML = blockLoadingTemplate
  }
  else {
    return
  }
}

export function fixedLoading() {
  const loadingFixed = document.querySelector('.loading__fixed')
  loadingFixed.children.length !== 0 ? loadingFixed.children[0].remove() : []
  loadingFixed.classList.toggle('d-n')
  let el_img = document.createElement('img')
  el_img.setAttribute('src', 'img/loading-oval-white.svg')
  loadingFixed.appendChild(el_img)
}