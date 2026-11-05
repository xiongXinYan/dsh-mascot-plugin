// @ts-check

/**
 * 内置立绘。
 *
 * 为什么要自己画一个：DSH Web 不带 Live2D 运行时，内置模型也还没通过宿主挂出来，
 * 所以"插件装上了"和"看得见东西"之间缺一环。这层 SVG 就是那一环 ——
 * 它不依赖任何运行时、任何外部资源，同时也把姿态/眼神这两套接口先跑通，
 * 以后换成 Live2D 模型时接口不用动。
 *
 * 画的是一个 160×200 的 Q 版半身像，分层结构（从后往前）：
 *   影子 → 后发 → 脖子 → 身体 → 头（脸/刘海/鬓发/眉/眼/腮红/嘴/发夹/呆毛）→ 特效
 * 每层都留了 class，动画写在 styles.js 里，这里只负责形状。
 */

/** 多实例时给渐变 id 加后缀，避免同一页两只板娘互相覆盖。 */
let instanceSeq = 0

/**
 * 造一个立绘节点。
 * @returns {HTMLDivElement}
 */
export function createCharacter() {
  const uid = `mc${++instanceSeq}`
  const el = document.createElement('div')
  el.className = 'dsh-mascot__art'
  // 纯静态字符串，没有任何用户输入拼进来。
  el.innerHTML = markup(uid)
  return el
}

/**
 * @param {string} u id 前缀
 * @returns {string}
 */
function markup(u) {
  return `<svg class="dsh-mascot__svg" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${u}-skin" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#fff3ea"/>
      <stop offset="1" stop-color="#ffd8c2"/>
    </linearGradient>
    <linearGradient id="${u}-hair" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#726bb0"/>
      <stop offset="0.55" stop-color="#4f4979"/>
      <stop offset="1" stop-color="#383356"/>
    </linearGradient>
    <radialGradient id="${u}-glow" cx="0.5" cy="0.52" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="0.62" stop-color="#ffffff" stop-opacity="0.05"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${u}-iris" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="#2c56a8"/>
      <stop offset="0.52" stop-color="#5f9bff"/>
      <stop offset="1" stop-color="#b6d6ff"/>
    </linearGradient>
    <linearGradient id="${u}-dress" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="#93aeea"/>
      <stop offset="1" stop-color="#4f6cb4"/>
    </linearGradient>
  </defs>

  <ellipse class="mascot-glow" cx="80" cy="108" rx="76" ry="90" fill="url(#${u}-glow)"/>
  <ellipse class="mascot-shadow" cx="80" cy="194" rx="33" ry="5.5" fill="#0f172a" opacity="0.15"/>

  <g class="mascot-breathe">
    <!-- 后发：身体之后的大块头发，露出肩后一层 -->
    <path class="mascot-hair-back" d="M80 24 C 118 24, 142 54, 139 94 C 137 120, 130 136, 126 160 L 34 160 C 30 136, 23 120, 21 94 C 18 54, 42 24, 80 24 Z" fill="url(#${u}-hair)"/>

    <path class="mascot-neck" d="M70 112 C 70 124, 70 130, 70 136 L 90 136 C 90 130, 90 124, 90 112 Z" fill="#f8ccb4"/>

    <!-- 身体 -->
    <g class="mascot-body">
      <path d="M80 126 C 61 126, 45 135, 39 151 C 32 169, 30 184, 30 200 L 130 200 C 130 184, 128 169, 121 151 C 115 135, 99 126, 80 126 Z" fill="url(#${u}-dress)"/>
      <path d="M68 128 C 71 141, 76 147, 80 153 C 84 147, 89 141, 92 128 Z" fill="#eef4ff" opacity="0.95"/>
      <path d="M80 151 C 67 142, 59 151, 67 158 C 73 161, 78 157, 80 151 Z" fill="#ff8fab"/>
      <path d="M80 151 C 93 142, 101 151, 93 158 C 87 161, 82 157, 80 151 Z" fill="#ff8fab"/>
      <circle cx="80" cy="151" r="3.4" fill="#ff6f95"/>
    </g>

    <g class="mascot-head">
      <!-- 耳 -->
      <ellipse cx="38" cy="93" rx="7" ry="9" fill="#f8ccb4"/>
      <ellipse cx="122" cy="93" rx="7" ry="9" fill="#f8ccb4"/>

      <!-- 脸 -->
      <path d="M80 44 C 105 44, 122 62, 122 88 C 122 110, 104 130, 80 132 C 56 130, 38 110, 38 88 C 38 62, 55 44, 80 44 Z" fill="url(#${u}-skin)"/>

      <!-- 鬓发 -->
      <path class="mascot-lock mascot-lock--l" d="M40 74 C 30 93, 28 120, 34 148 C 36 157, 47 157, 48 148 C 42 120, 43 93, 50 76 Z" fill="url(#${u}-hair)"/>
      <path class="mascot-lock mascot-lock--r" d="M40 74 C 30 93, 28 120, 34 148 C 36 157, 47 157, 48 148 C 42 120, 43 93, 50 76 Z" fill="url(#${u}-hair)" transform="translate(160 0) scale(-1 1)"/>

      <!-- 刘海 -->
      <path class="mascot-bangs" d="M37 89 C 33 56, 53 29, 80 29 C 107 29, 127 56, 123 89 C 119 70, 111 57, 100 52 C 96 66, 86 72, 76 64 C 70 74, 58 74, 52 63 C 45 68, 40 78, 37 89 Z" fill="url(#${u}-hair)"/>
      <path d="M57 41 C 65 33, 79 30, 93 34" fill="none" stroke="#8a83b8" stroke-width="3" stroke-linecap="round" opacity="0.5"/>

      <!-- 呆毛 -->
      <path class="mascot-ahoge" d="M79 31 C 76 17, 86 6, 98 11 C 89 12, 83 20, 85 32 Z" fill="url(#${u}-hair)"/>

      <!-- 发夹 -->
      <path class="mascot-clip" d="M104 50 L107 57 L114 60 L107 63 L104 70 L101 63 L94 60 L101 57 Z" fill="#ffd05c"/>

      <!-- 眉 -->
      <g class="mascot-brows" stroke="#544d7a" stroke-width="2.3" stroke-linecap="round" fill="none" opacity="0.78">
        <path d="M53 68 C 57 64, 67 64, 71 66.5"/>
        <path d="M107 68 C 103 64, 93 64, 89 66.5"/>
      </g>

      <!-- 眼 -->
      <g class="mascot-eyes">
        <g transform="translate(63 90)">
          <ellipse rx="11.6" ry="12.6" fill="#fffcfe"/>
          <g class="mascot-pupil">
            <ellipse cy="1" rx="9" ry="10.4" fill="url(#${u}-iris)"/>
            <ellipse cy="2" rx="4.3" ry="5.4" fill="#151a2d"/>
            <circle cx="-3.8" cy="-4.6" r="3.2" fill="#ffffff" opacity="0.92"/>
            <circle cx="3.2" cy="5.6" r="1.7" fill="#ffffff" opacity="0.62"/>
          </g>
          <path d="M-12 -6 C -9.5 -15, 9.5 -15, 12 -6" fill="none" stroke="#2a2340" stroke-width="3.6" stroke-linecap="round"/>
        </g>
        <g transform="translate(97 90)">
          <ellipse rx="11.6" ry="12.6" fill="#fffcfe"/>
          <g class="mascot-pupil">
            <ellipse cy="1" rx="9" ry="10.4" fill="url(#${u}-iris)"/>
            <ellipse cy="2" rx="4.3" ry="5.4" fill="#151a2d"/>
            <circle cx="-3.8" cy="-4.6" r="3.2" fill="#ffffff" opacity="0.92"/>
            <circle cx="3.2" cy="5.6" r="1.7" fill="#ffffff" opacity="0.62"/>
          </g>
          <path d="M-12 -6 C -9.5 -15, 9.5 -15, 12 -6" fill="none" stroke="#2a2340" stroke-width="3.6" stroke-linecap="round"/>
        </g>
      </g>

      <!-- 腮红 -->
      <ellipse cx="50" cy="104" rx="9" ry="4.8" fill="#ff9db1" opacity="0.4"/>
      <ellipse cx="110" cy="104" rx="9" ry="4.8" fill="#ff9db1" opacity="0.4"/>

      <!-- 鼻 -->
      <path d="M79.4 99 C 81 100.4, 81 101.4, 79.4 102.4" fill="none" stroke="#e3a892" stroke-width="1.6" stroke-linecap="round"/>

      <!-- 嘴：三种形态，由 data-mood 切换 -->
      <g class="mascot-mouths">
        <path class="mascot-mouth mascot-mouth--smile" d="M72.5 110.5 C 76.5 115.5, 83.5 115.5, 87.5 110.5" fill="none" stroke="#c76b7c" stroke-width="2.6" stroke-linecap="round"/>
        <path class="mascot-mouth mascot-mouth--flat" d="M75.5 112.5 L 84.5 112.5" fill="none" stroke="#c76b7c" stroke-width="2.4" stroke-linecap="round"/>
        <g class="mascot-mouth mascot-mouth--open">
          <ellipse cx="80" cy="112.5" rx="5.6" ry="6.2" fill="#b1556a"/>
          <ellipse cx="80" cy="115.4" rx="3.2" ry="2.1" fill="#ff8fa0"/>
        </g>
      </g>
    </g>

    <!-- 等待确认时的琥珀光环 -->
    <circle class="mascot-ring" cx="80" cy="88" r="60" fill="none" stroke="#ffb84c" stroke-width="2.5"/>

    <!-- 打盹的 zZz -->
    <g class="mascot-zzz" fill="#9a92c8" font-size="12" font-weight="600">
      <text class="mascot-zzz__a" x="116" y="50">Z</text>
      <text class="mascot-zzz__b" x="126" y="36">z</text>
    </g>
  </g>
</svg>`
}
