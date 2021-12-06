export function blockLoading(sort) {
  switch (sort) {
    case 'products':
      const prodsList = document.querySelector('.prods__list')
      prodsList.innerHTML = /* html */ `
      <li class="loading__item">
        <div class="loading flex-center">
          <img src="img/loading-oval.svg">
        </div>
      </li>
      `
      break
    case 'carts':
      const cartList = document.querySelector('.cart__list')
      cartList.innerHTML = /* html */ `
      <li class="loading__item">
        <div class="loading flex-center">
          <img src="img/loading-oval.svg">
        </div>
      </li>
      `
      break
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