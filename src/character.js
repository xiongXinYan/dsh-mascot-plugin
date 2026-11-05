// @ts-check

/**
 * 内置立绘：一只中华五黑犬（立耳、全身乌黑、黑鼻黑舌，配一条红项圈）。
 *
 * 为什么自己画：DSH Web 不带 Live2D 运行时，内置模型也还没通过宿主挂出来，
 * "插件装上了"和"看得见东西"之间缺一环。这层 SVG 就是那一环——零依赖、零外部资源，
 * 同时把姿态和眼神两套接口先跑通，以后换 Live2D 模型时上层代码不用动。
 *
 * 视角选的是正面偏 3/4 的坐姿，不是正对着看的对称脸：
 *   完全对称的正面像证件照，"趴下/撅屁股/伸懒腰"只能靠压扁拉伸硬凑。
 *   偏一点角度，同一个身体在坐、趴、跳之间换形才说得过去。
 *
 * 画黑狗真正的难点不是"黑"，而是"黑得有层次"：
 *   纯黑在深色界面上会糊成一团影子。所以毛色用带冷紫的炭黑，靠四件事撑可读性：
 *     1. 上亮下暗的渐变（体积）
 *     2. 左上角一道冷调轮廓光（深色背景下的关键）
 *     3. 吻部比脸略亮一档（狗必须有吻，不然会读成猫或熊）
 *     4. 琥珀色眼睛 + 白高光（视觉落点）
 *
 * 分层从后往前：影子 → 尾巴 → 后腿 → 身体 → 前腿 → 项圈 → 头（耳/眉/眼/吻/鼻/舌）
 * 每层都留了 class，动画写在 styles.js 里，这里只负责形状。
 */

/** 多实例时给渐变 id 加后缀，避免同一页两只狗互相覆盖。 */
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
  return `<svg class="dsh-mascot__svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="${u}-head" x1="0.24" y1="0" x2="0.76" y2="1">
      <stop offset="0" stop-color="#413e48"/>
      <stop offset="0.44" stop-color="#27252d"/>
      <stop offset="1" stop-color="#16151a"/>
    </linearGradient>
    <linearGradient id="${u}-body" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#37343c"/>
      <stop offset="0.5" stop-color="#211f26"/>
      <stop offset="1" stop-color="#131217"/>
    </linearGradient>
    <linearGradient id="${u}-leg" x1="0.1" y1="0" x2="0.8" y2="1">
      <stop offset="0" stop-color="#36333d"/>
      <stop offset="1" stop-color="#1c1a21"/>
    </linearGradient>
    <linearGradient id="${u}-snout" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0" stop-color="#3d3a45"/>
      <stop offset="1" stop-color="#2d2b34"/>
    </linearGradient>
    <radialGradient id="${u}-iris" cx="0.42" cy="0.32" r="0.8">
      <stop offset="0" stop-color="#ffd88f"/>
      <stop offset="0.46" stop-color="#d28c39"/>
      <stop offset="1" stop-color="#5a3010"/>
    </radialGradient>
    <linearGradient id="${u}-rim" x1="0.1" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="#cfcbd8" stop-opacity="0.7"/>
      <stop offset="0.5" stop-color="#cfcbd8" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#cfcbd8" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="${u}-collar" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#f0705f"/>
      <stop offset="1" stop-color="#b53a3c"/>
    </linearGradient>
    <linearGradient id="${u}-tongue" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0" stop-color="#8d4660"/>
      <stop offset="1" stop-color="#55263a"/>
    </linearGradient>
    <radialGradient id="${u}-glow" cx="0.5" cy="0.55" r="0.5">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <ellipse class="dog-glow" cx="100" cy="112" rx="80" ry="86" fill="url(#${u}-glow)"/>
  <ellipse class="dog-shadow" cx="100" cy="190" rx="44" ry="6.5" fill="#0b0810" opacity="0.26"/>

  <g class="dog-hop">
    <g class="dog-pose">
      <g class="dog-breathe">

        <!-- 尾巴：从身体右后方伸出来，卷一个小勾 -->
        <g class="dog-tail-pose">
          <g class="dog-tail-wag">
            <path d="M137 164 C160 160 174 141 165 125 C159 114 146 117 147 130"
                  fill="none" stroke="url(#${u}-body)" stroke-width="13" stroke-linecap="round"/>
            <path d="M150 156 C164 151 170 139 165 128"
                  fill="none" stroke="url(#${u}-rim)" stroke-width="2.6" stroke-linecap="round"/>
          </g>
        </g>

        <!-- 后腿：坐在屁股上，比身体更暗，往后退一层 -->
        <g class="dog-hind">
          <ellipse cx="64" cy="162" rx="19" ry="22" fill="#231e2d"/>
          <ellipse cx="63" cy="180" rx="13" ry="6.5" fill="#1a1524"/>
          <ellipse cx="136" cy="164" rx="18" ry="21" fill="#1e1927"/>
          <ellipse cx="137" cy="181" rx="12" ry="6" fill="#161120"/>
        </g>

        <!-- 身体：梨形，上半收在头后面 -->
        <g class="dog-body">
          <path d="M100 104 C124 104 140 121 145 147 C148 163 146 177 142 186 L58 186 C54 177 52 163 55 147 C60 121 76 104 100 104 Z"
                fill="url(#${u}-body)" stroke="#4b4856" stroke-opacity="0.45" stroke-width="1.5"/>
          <path d="M58 158 C60 133 71 116 84 108" fill="none" stroke="url(#${u}-rim)" stroke-width="3" stroke-linecap="round"/>
          <!-- 胸口的受光面：没有这块，下半身会是一整块死黑 -->
          <ellipse cx="100" cy="134" rx="21" ry="19" fill="#4c4460" opacity="0.34"/>
        </g>

        <!-- 前腿：一条整体路径，脚掌和腿同色，不然会看成两块贴片 -->
        <g class="dog-leg-l">
          <path d="M77 141 C77 135 97 135 97 141 L97 176 C97 184 93 188 87 188 C81 188 77 184 77 176 Z"
                fill="url(#${u}-leg)" stroke="#46434f" stroke-opacity="0.4" stroke-width="1.4"/>
          <path d="M85 188 L85 182 M91 188 L91 182" stroke="#120e1a" stroke-width="1.7" stroke-linecap="round"/>
        </g>
        <g class="dog-leg-r">
          <path d="M103 141 C103 135 123 135 123 141 L123 176 C123 184 119 188 113 188 C107 188 103 184 103 176 Z"
                fill="url(#${u}-leg)" stroke="#46434f" stroke-opacity="0.4" stroke-width="1.4"/>
          <path d="M109 188 L109 182 M115 188 L115 182" stroke="#120e1a" stroke-width="1.7" stroke-linecap="round"/>
        </g>

        <!-- 项圈：全场唯一的高饱和色，黑狗需要这一点红来提神 -->
        <g class="dog-collar">
          <path d="M59 130 C76 146 124 146 141 130 L139 141 C122 156 78 156 61 141 Z" fill="url(#${u}-collar)"/>
          <path d="M62 134 C78 148 122 148 138 134" fill="none" stroke="#ffb3a8" stroke-width="1.4" opacity="0.45"/>
          <circle cx="100" cy="152" r="6.4" fill="#f4c65a"/>
          <circle cx="100" cy="152" r="2.4" fill="#bf8f2b"/>
        </g>

        <!-- 头：外层是姿态（CSS 变量），中层是待机微晃（关键帧），内层跟鼠标（--gaze-*）。
             三层分开是必须的——transform 只有一个，同一个元素上既要过渡又要动画就会互相覆盖 -->
        <g class="dog-head-pose">
          <g class="dog-head-sway">
          <g class="dog-head">
            <!-- 耳：立耳。中华田园犬的标志，也是这只狗最有表情的部位 -->
            <g class="dog-ear dog-ear--l">
              <path d="M60 56 C55 42 56 27 63 21 C68 17 74 20 79 29 C85 40 88 46 88 48 C80 54 68 58 60 56 Z"
                    fill="url(#${u}-head)" stroke="#4b4856" stroke-opacity="0.45" stroke-width="1.5"/>
              <path d="M64 50 C61 40 61 29 66 24 C70 21 74 25 77 33 C80 40 82 45 82 47 C76 51 68 53 64 50 Z"
                    fill="#3a2733"/>
            </g>
            <g class="dog-ear dog-ear--r">
              <path d="M140 56 C145 42 144 27 137 21 C132 17 126 20 121 29 C115 40 112 46 112 48 C120 54 132 58 140 56 Z"
                    fill="url(#${u}-head)" stroke="#4b4856" stroke-opacity="0.45" stroke-width="1.5"/>
              <path d="M136 50 C139 40 139 29 134 24 C130 21 126 25 123 33 C120 40 118 45 118 47 C124 51 132 53 136 50 Z"
                    fill="#3a2733"/>
            </g>

            <!-- 脸 -->
            <path d="M100 38 C131 38 150 58 150 86 C150 112 130 130 100 130 C70 130 50 112 50 86 C50 58 69 38 100 38 Z"
                  fill="url(#${u}-head)" stroke="#4b4856" stroke-opacity="0.45" stroke-width="1.5"/>
            <path d="M56 72 C60 52 77 41 96 39" fill="none" stroke="url(#${u}-rim)" stroke-width="3.4" stroke-linecap="round"/>
            <!-- 腮边的碎毛，把圆脸打破一点，不然像熊 -->
            <path d="M52 96 L40 104 L54 111 Z" fill="url(#${u}-head)"/>
            <path d="M148 96 L160 104 L146 111 Z" fill="url(#${u}-head)"/>

            <!-- 眉：两撮亮一点的短毛，表情全靠它 -->
            <g class="dog-brows" stroke="#5a5663" stroke-width="3.2" stroke-linecap="round" fill="none">
              <path d="M67 72 C71 66 82 65 87 70"/>
              <path d="M133 72 C129 66 118 65 113 70"/>
            </g>

            <!-- 眼：黑狗配琥珀瞳，深色背景上才抓得住视线 -->
            <g class="dog-eyes">
              <g transform="translate(79 89)">
                <g class="dog-eye-pose">
                  <g class="dog-eye dog-eye--l">
                    <ellipse rx="12" ry="13" fill="#0c0a11"/>
                    <circle cy="1" r="8.6" fill="url(#${u}-iris)"/>
                    <circle cy="1.6" r="5" fill="#08060c"/>
                    <circle cx="-4" cy="-4.6" r="3.7" fill="#ffffff" opacity="0.95"/>
                    <circle cx="3.4" cy="4.6" r="1.9" fill="#ffffff" opacity="0.5"/>
                  </g>
                </g>
              </g>
              <g transform="translate(121 89)">
                <g class="dog-eye-pose">
                  <g class="dog-eye dog-eye--r">
                    <ellipse rx="12" ry="13" fill="#0c0a11"/>
                    <circle cy="1" r="8.6" fill="url(#${u}-iris)"/>
                    <circle cy="1.6" r="5" fill="#08060c"/>
                    <circle cx="-4" cy="-4.6" r="3.7" fill="#ffffff" opacity="0.95"/>
                    <circle cx="3.4" cy="4.6" r="1.9" fill="#ffffff" opacity="0.5"/>
                  </g>
                </g>
              </g>
              <!-- 眼睑：眯眼和闭眼用画的弧线，比压扁眼球干净 -->
              <g class="dog-lids" stroke="#0b0910" stroke-width="3.2" stroke-linecap="round" fill="none">
                <path class="dog-lid dog-lid--squint" d="M68 87 C73 79 84 79 90 87"/>
                <path class="dog-lid dog-lid--squint" d="M110 87 C116 79 127 79 132 87"/>
                <path class="dog-lid dog-lid--sleep" d="M68 87 C73 94 84 94 90 87"/>
                <path class="dog-lid dog-lid--sleep" d="M110 87 C116 94 127 94 132 87"/>
              </g>

              <!-- 眨眼用的眼睑：只有 wink 的时候才露出来 -->
              <g class="dog-wink-line" stroke="#0b0910" stroke-width="3.4" stroke-linecap="round" fill="none">
                <path d="M112 89 C117 94 126 94 131 89"/>
              </g>
            </g>

            <!-- 吻部：比脸亮一档，狗和猫/熊的分界线就在这里 -->
            <ellipse cx="100" cy="114" rx="23.5" ry="17" fill="url(#${u}-snout)"/>
            <path d="M84 105 C91 100 109 100 116 105" fill="none" stroke="#57506a" stroke-width="1.8" opacity="0.45" stroke-linecap="round"/>
            <g fill="#55515e" opacity="0.5">
              <circle cx="80" cy="115" r="1.1"/><circle cx="78" cy="120" r="1.1"/><circle cx="82" cy="123" r="1.1"/>
              <circle cx="120" cy="115" r="1.1"/><circle cx="122" cy="120" r="1.1"/><circle cx="118" cy="123" r="1.1"/>
            </g>

            <!-- 鼻：黑鼻头，五黑里的第二黑 -->
            <path d="M88 99 C88 94 112 94 112 99 C112 106 106 111 100 111 C94 111 88 106 88 99 Z" fill="#0b0910"/>
            <ellipse cx="95.5" cy="98.5" rx="4.6" ry="2.2" fill="#ffffff" opacity="0.32"/>

            <!-- 舌：五黑连舌头都是黑的，这里用乌梅色，明暗主题都不脏 -->
            <g class="dog-tongue">
              <path d="M91 112 C91 121 109 121 109 112 C109 127 105 134 100 134 C95 134 91 127 91 112 Z"
                    fill="url(#${u}-tongue)"/>
              <path d="M100 124 L100 131" stroke="#a35a74" stroke-width="1.5" opacity="0.55" stroke-linecap="round"/>
            </g>

            <!-- 嘴：ω 形压在舌头上，把舌头"挂"住 -->
            <path d="M100 111 C100 117 95 120 91 117" fill="none" stroke="#171220" stroke-width="2.6" stroke-linecap="round"/>
            <path d="M100 111 C100 117 105 120 109 117" fill="none" stroke="#171220" stroke-width="2.6" stroke-linecap="round"/>
          </g>
          </g>
        </g>

        <!-- 等待确认的暖色光环 -->
        <circle class="dog-ring" cx="100" cy="96" r="72" fill="none" stroke="#ffb84c" stroke-width="2.5"/>

        <!-- 打盹的 zZz -->
        <g class="dog-zzz" fill="#a79fc6" font-size="13" font-weight="700" font-family="system-ui, sans-serif">
          <text class="dog-zzz__a" x="152" y="64">z</text>
          <text class="dog-zzz__b" x="164" y="46">Z</text>
        </g>
      </g>
    </g>
  </g>
</svg>`
}
