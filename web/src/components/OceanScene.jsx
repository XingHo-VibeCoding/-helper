import Fish from './Fish.jsx'

// 全局海底装饰层:固定铺满视口,垫在所有页面内容下面
// 纯装饰,不携带信息:aria-hidden + pointer-events:none,打印时隐藏
function Seaweed({ className, gradientId }) {
  return (
    <svg className={className} viewBox="0 0 120 220" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#0c5a4a" />
          <stop offset="1" stopColor="#48e5c2" />
        </linearGradient>
      </defs>
      <g stroke={`url(#${gradientId})`} fill="none" strokeLinecap="round">
        <path d="M25 220 C 15 170, 38 140, 24 90 C 16 55, 30 30, 24 6" strokeWidth="12" />
        <path d="M60 220 C 70 175, 48 145, 64 95 C 74 60, 58 35, 66 10" strokeWidth="10" />
        <path d="M95 220 C 85 185, 108 155, 94 110 C 86 80, 100 55, 92 30" strokeWidth="9" />
      </g>
    </svg>
  )
}

export default function OceanScene() {
  return (
    <div className="ocean-bg" aria-hidden="true">
      {/* 水下光柱 */}
      <span className="sea-ray sr-1" />
      <span className="sea-ray sr-2" />

      {/* 巡游的鱼 */}
      <Fish className="sea-fish sf-1" color="#3fd0e8" />
      <Fish className="sea-fish sf-2" color="#6ea8ff" />
      <Fish className="sea-fish sf-3" color="#48e5c2" />

      {/* 上浮的泡泡 */}
      <span className="sea-bubble sb-1" />
      <span className="sea-bubble sb-2" />
      <span className="sea-bubble sb-3" />
      <span className="sea-bubble sb-4" />
      <span className="sea-bubble sb-5" />
      <span className="sea-bubble sb-6" />
      <span className="sea-bubble sb-7" />

      {/* 底部海草(左右各一丛,随风摆动) */}
      <span className="sea-weed sw-l">
        <Seaweed className="weed-svg" gradientId="weedGradL" />
      </span>
      <span className="sea-weed sw-r">
        <Seaweed className="weed-svg" gradientId="weedGradR" />
      </span>
    </div>
  )
}
