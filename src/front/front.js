import error from './form.js'

Object.keys(error).forEach(prop => {
  const target = document.querySelector(`[name=${[prop]}]`)
  switch (error[prop][0]) {
    case 'empty':
      appendEl(target, {
        el: 'span',
        className: 'order__required',
        textContent: '必填 !'
      })
      break
    case 'formatError':
      appendEl(target, {
        el: 'span',
        className: 'order__required',
        textContent: '格式錯誤 !'
      })
      break
    default:
      return
  }
})

function appendEl(target, obj) {
  const { el, className, textContent } = obj
  let span = document.createElement(el)
  let text = document.createTextNode(textContent)
  span.setAttribute('class', className)
  span.appendChild(text)
  target.parentNode.appendChild(span)
}