import { useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

// 学生填写二维码:点"生成"在本地把填写链接画成二维码,点"保存图片"下载 PNG
// 纯前端实现,不经过任何服务器;链接 = 当前网站地址 + /form
function formUrl() {
  return window.location.origin + '/form'
}

export default function FormQrCode() {
  const [show, setShow] = useState(false)

  // 把画布内容导出为 PNG 并触发浏览器下载
  function savePng() {
    const canvas = document.querySelector('.qr-box canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'xinghe-helper-填写二维码.png'
    a.click()
  }

  return (
    <div className="qr-wrap">
      {!show ? (
        <button type="button" className="btn-plain qr-btn" onClick={() => setShow(true)}>
          生成二维码(发给学生扫)
        </button>
      ) : (
        <div className="qr-box">
          <QRCodeCanvas value={formUrl()} size={160} marginSize={2} />
          <div className="qr-actions">
            <button type="button" className="btn-plain qr-btn" onClick={savePng}>
              保存图片
            </button>
            <button type="button" className="btn-plain qr-btn" onClick={() => setShow(false)}>
              收起
            </button>
          </div>
          <p className="qr-hint">扫这个码直接进学生填写页,链接:{formUrl()}</p>
        </div>
      )}
    </div>
  )
}
