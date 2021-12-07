export const swal = () => {
  // ----- 通用 -----
  const success_toast = (title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: title,
    })
  }

  // 確認通知
  const confirm_alert = (confirmObj) => {
    const { fn, arg, text } = confirmObj
    Swal.fire({
      title: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '確認',
      cancelButtonText: '取消'
    }).then((result) => {
      if (result.isConfirmed) {
        fn(arg)
      }
      else return
    })
  }

  // ----- 前台 -----
  // 送出訂單成功
  const success_sendOrder = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '已送出訂單，感謝您 ˙˚ʚ(´◡`)ɞ˚˙',
      showConfirmButton: false,
      timer: 1500
    })
  }

  // 表單驗證失敗
  const error_orderError = (html) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'error',
      title: html
    })
  }

  // ----- 後台 -----
  // 訂單狀態切換
  const success_orderToast = (title, id) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: title,
      text: `訂單編號: ${id}`
    })
  }

  // 清除全部訂單成功
  const success_clearOrders = () => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '訂單已全部清空 (*・ω・)ﾉ',
      showConfirmButton: false,
      timer: 1500
    })
  }

  return {
    success_toast,
    success_sendOrder,
    error_orderError,
    confirm_alert,
    success_orderToast,
    success_clearOrders
  }
}