const orderForm = document.querySelector('.order__form')


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
      // message: '^信箱格式錯誤 !'
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

const error = validate(orderForm, constraints)
console.log(error)

export default error