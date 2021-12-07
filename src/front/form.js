// ----- Module -----
import { swal } from '../vendor/swal.js'
import { CLI_apiRequest } from '../api.js'
import { cartData, cartTask } from './main.js'

(function () {
  const { success_sendOrder } = swal()

  // ----- DOM -----
  const orderForm = document.querySelector('.order__form')
  const inputs = Array.from(orderForm.querySelectorAll('input[name], select[name]'))

  // validate 驗證器
  const constraints = {
    name: {
      presence: {
        message: '^empty'
      }
    },
    tel: {
      presence: {
        message: '^empty'
      },
      format: {
        pattern: /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-\d{3})/,
        message: '^formatError'
      }
    },
    email: {
      presence: {
        message: '^empty'
      },
      email: {
        message: '^formatError'
      }
    },
    address: {
      presence: {
        message: '^empty'
      },
    },
    payment: {
      presence: {
        message: '^empty'
      },
    }
  }

  // 將所有要驗證的 input 跑迴圈偵錯
  function showErrors(errors) {
    inputs.forEach(input => {
      // && 回傳第二個值 errors[input.name]
      eachInputShowErrors(input, errors && errors[input.name])
    })
  }

  // 判斷這個 input 要做什麼事情
  function eachInputShowErrors(input, errors) {
    // 重置表單提示
    resetForm(input)
    // 錯誤時新增相對應提醒 DOM
    if (errors) {
      switch (errors[0]) {
        case 'empty':
          appendEl(input, {
            el: 'span',
            className: 'order__required',
            textContent: '必填 !'
          })
          break
        case 'formatError':
          appendEl(input, {
            el: 'span',
            className: 'order__required',
            textContent: '格式錯誤 !'
          })
          break
        default:
          return
      }
      // input 外框加上 error 樣式
      input.classList.add('error')
    }
    else {
      // input 外框加上 success 樣式
      input.classList.add('success')
    }
  }

  // add DOM node
  function appendEl(target, obj) {
    const { el, className, textContent } = obj
    let span = document.createElement(el)
    let text = document.createTextNode(textContent)
    span.setAttribute('class', className)
    span.appendChild(text)
    target.parentNode.appendChild(span)
  }

  // 送出訂單資料
  function submitHandler() {
    const errors = validate(orderForm, constraints)
    const { error_orderError } = swal()

    showErrors(errors || {})
    if (!errors) {
      // 都沒有錯誤就執行
      console.log('沒有錯誤')
      // 待新增執行效果
      sendOrder()
    }
    else {
      // Swal
      error_orderError()
    }
  }

  // 重置表單提示
  function resetForm(input) {
    input.classList.remove('error')
    input.classList.remove('success')
    const errorDOM = [...input.parentNode.children].find(dom => dom.classList.contains('order__required'))
    if (errorDOM) errorDOM.remove()
  }

  // 送出表單
  async function sendOrder() {
    try {
      // 判斷購物車有無東西
      if (cartData.carts.length === 0) {
        alert('請先新增商品至購物車 !')
        return
      }
      else {
        const { POST_order } = CLI_apiRequest()
        let obj = {}
        inputs.forEach(input => {
          obj[input.name] = input.value
          input.value = ''
          input.classList.remove('error')
          input.classList.remove('success')
        })
        console.log(obj)
        const sendOrderRes = await POST_order({
          "data": {
            "user": obj
          }
        })
        console.log('(表單送出成功)sendOrderRes.data: ', sendOrderRes.data)
        // 購物車自動清空 => 更新購物車
        cartTask()
        success_sendOrder()
      }
    }
    catch (err) {
      throw err.response.data
    }
  }

  // ----- Listener -----
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault()
    submitHandler()
  }, false)

  inputs.forEach(input => {
    input.addEventListener('change', function (e) {
      const errors = validate(orderForm, constraints)
      console.log('Validate Errors: ', errors)
      eachInputShowErrors(this, errors && errors[this.name])
    }, false)
  })
})()