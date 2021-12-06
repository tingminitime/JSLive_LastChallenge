const menuOpenBtn = document.querySelector('.menu__btn')
const menuCloseBtn = document.querySelector('.menu-mobile__toggle')
const mobileMenu = document.querySelector('.menu-mobile')
const mask = document.querySelector('.mask')

function showMenu(e) {
  mobileMenu.classList.add('active')
  mask.classList.add('active')
}

function hideMenu(e) {
  mobileMenu.classList.remove('active')
  mask.classList.remove('active')
}

menuOpenBtn.addEventListener('click', showMenu, false)
menuCloseBtn.addEventListener('click', hideMenu, false)