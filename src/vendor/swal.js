export const swal = () => {
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

  // 加入購物車成功
  const success_addCart = () => {
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
      title: '已加入購物車'
    })
  }

  // 刪除購物車商品成功
  const success_deleteCartProd = () => {
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
      title: '刪除成功'
    })
  }

  // 清空購物車成功
  const success_clearCart = () => {
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
      title: '購物車已清空'
    })
  }

  // 表單驗證失敗
  const error_orderError = () => {
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
      title: '<p style="margin-bottom:8px;">請檢查表單是否填寫正確</p><p>Σ(O_O)</p>'
    })
  }

  return {
    success_sendOrder,
    success_addCart,
    success_deleteCartProd,
    success_clearCart,
    error_orderError
  }
}