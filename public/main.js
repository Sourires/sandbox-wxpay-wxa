(function() {
  'use strict'

  const _csrf = $('#pay').data('csrf')
  const modalQuery = $('#modal-query')

  /**
   * 对话框的启用状态。
   */
  modalQuery.on('hidden.bs.modal', () => {
    localStorage.setItem('#modal-query', 'hide')
  })

  const modalQueryState = localStorage.getItem('#modal-query')

  if (modalQueryState === 'show') {
    modalQuery.modal()
  }

  /**
   * JSAPI 微信支付。
   *
   * @param  {Object} wxJSApiParams 支付需要的参数数据。
   */
  const wxPay = (wxJSApiParams) => {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      wxJSApiParams,
      (response) => {
        console.log(response)
      }
    )
  }

  /**
   * 请求支付。
   */
  $('#pay').click(() => {
    $.ajax({
      url: '/checkout/pay',
      method: 'POST',
      data: {
        _csrf,
        total_fee: 3,
        product_id: 1,
        body: '测试支付'
      },
      success: (response) => {
        console.log(response)
        if (response) {
          modalQuery.modal()
          localStorage.setItem('#modal-query', 'show')

          wxPay(response)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  })

  /**
   * 查询支付结果。
   */
  $('#order-query').click(() => {
    $.ajax({
      url: '/checkout/query',
      method: 'POST',
      data: {
        _csrf
      },
      success: (response) => {
        switch (response.trade_state) {
          case 'SUCCESS':
            window.location.href = '/checkout/completed'
            break
          default:
            console.log(response)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  })
}())
