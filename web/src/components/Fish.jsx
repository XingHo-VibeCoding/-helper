// 简笔小鱼:身体 + 尾鳍 + 背鳍 + 眼睛,颜色由调用方给
// Home 首页面板与全局海底装饰层(OceanScene)共用
export default function Fish({ className, color }) {
  return (
    <svg className={className} viewBox="0 0 120 60" aria-hidden="true">
      <g fill={color}>
        <ellipse cx="55" cy="30" rx="35" ry="18" />
        <path d="M88 30 L116 12 L108 30 L116 48 Z" />
        <path d="M42 14 Q54 -2 66 14 Z" />
      </g>
      <circle cx="32" cy="26" r="3.5" fill="#04121f" />
    </svg>
  )
}
