(function () {
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
    phone: {
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
    showErrors(errors || {})
    if (!errors) {
      // 都沒有錯誤就執行
      console.log('沒有錯誤')
    }
  }

  // 重置表單提示
  function resetForm(input) {
    input.classList.remove('error')
    input.classList.remove('success')
    const errorDOM = [...input.parentNode.children].find(dom => dom.classList.contains('order__required'))
    if (errorDOM) errorDOM.remove()
  }

  // ----- Listener -----
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault()
    submitHandler()
  }, false)

  inputs.forEach(input => {
    input.addEventListener('change', function (e) {
      const errors = validate(orderForm, constraints)
      console.log(errors)
      eachInputShowErrors(this, errors && errors[this.name])
    }, false)
  })
})()