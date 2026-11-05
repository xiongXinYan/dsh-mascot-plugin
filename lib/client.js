window.__ModuleLoader__.load({
  id: "dsh-mascot-plugin",
  factory: function (require) {
    'use strict';
    var module = { exports: {} };
    var exports = module.exports;
      "use strict";
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames = Object.getOwnPropertyNames;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __export = (target, all) => {
        for (var name2 in all)
          __defProp(target, name2, { get: all[name2], enumerable: true });
      };
      var __copyProps = (to, from, except, desc) => {
        if (from && typeof from === "object" || typeof from === "function") {
          for (let key of __getOwnPropNames(from))
            if (!__hasOwnProp.call(to, key) && key !== except)
              __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
        }
        return to;
      };
      var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

      // src/index.js
      var index_exports = {};
      __export(index_exports, {
        SIGNAL_EVENT: () => SIGNAL_EVENT,
        apply: () => apply,
        inject: () => inject,
        name: () => name
      });
      module.exports = __toCommonJS(index_exports);
      var import_react = require("react");

      // src/acts.js
      var ACT_MS = {
        sit: 1500,
        stretch: 2400,
        bow: 2600,
        wink: 1500,
        jump: 1200,
        nap: 4200,
        alert: 2200
      };
      var BASE_ACT = (
        /** @type {const} */
        "sit"
      );
      var ACT_POOL = {
        idle: ["stretch", "bow", "wink", "jump", "nap"],
        working: ["stretch", "wink", "bow"],
        waiting: ["alert"],
        sleepy: ["nap"],
        happy: ["jump", "wink"]
      };
      var HELD_ACTS = (
        /** @type {Partial<Record<MascotMood, MascotAct>>} */
        {
          waiting: "alert",
          sleepy: "nap"
        }
      );
      function shuffle(pool, random) {
        const copy = [...pool];
        for (let i = copy.length - 1; i > 0; i -= 1) {
          const j = Math.min(i, Math.floor(random() * (i + 1)));
          const a = (
            /** @type {MascotAct} */
            copy[i]
          );
          const b = (
            /** @type {MascotAct} */
            copy[j]
          );
          copy[i] = b;
          copy[j] = a;
        }
        return copy;
      }
      function gapMs(random) {
        return 620 + Math.floor(random() * 880);
      }
      function heldActOf(mood) {
        return HELD_ACTS[mood] ?? null;
      }
      function createActPlayer({ onAct, random = Math.random, schedule, cancel }) {
        const set = schedule ?? ((fn, ms) => Number(setTimeout(fn, ms)));
        const clear = cancel ?? ((id) => clearTimeout(id));
        let act = BASE_ACT;
        let queue = [];
        let mood = "idle";
        let timer = 0;
        let running = false;
        let poking = false;
        function play(next) {
          act = next;
          onAct(next);
        }
        function takeNext() {
          if (queue.length === 0) queue = shuffle(ACT_POOL[mood], random);
          const picked = queue.shift() ?? BASE_ACT;
          return picked === act && queue.length > 0 ? (
            /** @type {MascotAct} */
            queue.shift()
          ) : picked;
        }
        function after(ms, fn) {
          if (timer) clear(timer);
          timer = set(fn, ms);
        }
        function tick() {
          timer = 0;
          if (!running) return;
          if (poking) {
            poking = false;
            play(BASE_ACT);
            after(gapMs(random), tick);
            return;
          }
          const held = heldActOf(mood);
          if (held) {
            if (act !== held) play(held);
            return;
          }
          if (act === BASE_ACT) {
            const next = takeNext();
            play(next);
            after(Math.round(ACT_MS[next] * (mood === "working" ? 0.8 : 1)), tick);
          } else {
            play(BASE_ACT);
            after(gapMs(random), tick);
          }
        }
        return {
          start() {
            if (running) return;
            running = true;
            const held = heldActOf(mood);
            if (held) {
              play(held);
              return;
            }
            play(BASE_ACT);
            after(gapMs(random), tick);
          },
          setMood(next) {
            if (next === mood) return;
            mood = next;
            queue = [];
            poking = false;
            if (!running) return;
            const held = heldActOf(mood);
            if (held) {
              if (timer) clear(timer);
              timer = 0;
              play(held);
              return;
            }
            play(BASE_ACT);
            after(gapMs(random), tick);
          },
          poke(next) {
            if (!running) return;
            poking = true;
            if (timer) clear(timer);
            timer = 0;
            play(next);
            after(ACT_MS[next], tick);
          },
          current: () => act,
          destroy() {
            running = false;
            if (timer) clear(timer);
            timer = 0;
          }
        };
      }

      // src/character.js
      var instanceSeq = 0;
      function createCharacter() {
        const uid = `mc${++instanceSeq}`;
        const el = document.createElement("div");
        el.className = "dsh-mascot__art";
        el.innerHTML = markup(uid);
        return el;
      }
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

              <!-- \u5C3E\u5DF4\uFF1A\u4ECE\u8EAB\u4F53\u53F3\u540E\u65B9\u4F38\u51FA\u6765\uFF0C\u5377\u4E00\u4E2A\u5C0F\u52FE -->
              <g class="dog-tail-pose">
                <g class="dog-tail-wag">
                  <path d="M137 164 C160 160 174 141 165 125 C159 114 146 117 147 130"
                        fill="none" stroke="url(#${u}-body)" stroke-width="13" stroke-linecap="round"/>
                  <path d="M150 156 C164 151 170 139 165 128"
                        fill="none" stroke="url(#${u}-rim)" stroke-width="2.6" stroke-linecap="round"/>
                </g>
              </g>

              <!-- \u540E\u817F\uFF1A\u5750\u5728\u5C41\u80A1\u4E0A\uFF0C\u6BD4\u8EAB\u4F53\u66F4\u6697\uFF0C\u5F80\u540E\u9000\u4E00\u5C42 -->
              <g class="dog-hind">
                <ellipse cx="64" cy="162" rx="19" ry="22" fill="#231e2d"/>
                <ellipse cx="63" cy="180" rx="13" ry="6.5" fill="#1a1524"/>
                <ellipse cx="136" cy="164" rx="18" ry="21" fill="#1e1927"/>
                <ellipse cx="137" cy="181" rx="12" ry="6" fill="#161120"/>
              </g>

              <!-- \u8EAB\u4F53\uFF1A\u68A8\u5F62\uFF0C\u4E0A\u534A\u6536\u5728\u5934\u540E\u9762 -->
              <g class="dog-body">
                <path d="M100 104 C124 104 140 121 145 147 C148 163 146 177 142 186 L58 186 C54 177 52 163 55 147 C60 121 76 104 100 104 Z"
                      fill="url(#${u}-body)" stroke="#4b4856" stroke-opacity="0.45" stroke-width="1.5"/>
                <path d="M58 158 C60 133 71 116 84 108" fill="none" stroke="url(#${u}-rim)" stroke-width="3" stroke-linecap="round"/>
                <!-- \u80F8\u53E3\u7684\u53D7\u5149\u9762\uFF1A\u6CA1\u6709\u8FD9\u5757\uFF0C\u4E0B\u534A\u8EAB\u4F1A\u662F\u4E00\u6574\u5757\u6B7B\u9ED1 -->
                <ellipse cx="100" cy="134" rx="21" ry="19" fill="#4c4460" opacity="0.34"/>
              </g>

              <!-- \u524D\u817F\uFF1A\u4E00\u6761\u6574\u4F53\u8DEF\u5F84\uFF0C\u811A\u638C\u548C\u817F\u540C\u8272\uFF0C\u4E0D\u7136\u4F1A\u770B\u6210\u4E24\u5757\u8D34\u7247 -->
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

              <!-- \u9879\u5708\uFF1A\u5168\u573A\u552F\u4E00\u7684\u9AD8\u9971\u548C\u8272\uFF0C\u9ED1\u72D7\u9700\u8981\u8FD9\u4E00\u70B9\u7EA2\u6765\u63D0\u795E -->
              <g class="dog-collar">
                <path d="M59 130 C76 146 124 146 141 130 L139 141 C122 156 78 156 61 141 Z" fill="url(#${u}-collar)"/>
                <path d="M62 134 C78 148 122 148 138 134" fill="none" stroke="#ffb3a8" stroke-width="1.4" opacity="0.45"/>
                <circle cx="100" cy="152" r="6.4" fill="#f4c65a"/>
                <circle cx="100" cy="152" r="2.4" fill="#bf8f2b"/>
              </g>

              <!-- \u5934\uFF1A\u5916\u5C42\u662F\u59FF\u6001\uFF08CSS \u53D8\u91CF\uFF09\uFF0C\u4E2D\u5C42\u662F\u5F85\u673A\u5FAE\u6643\uFF08\u5173\u952E\u5E27\uFF09\uFF0C\u5185\u5C42\u8DDF\u9F20\u6807\uFF08--gaze-*\uFF09\u3002
                   \u4E09\u5C42\u5206\u5F00\u662F\u5FC5\u987B\u7684\u2014\u2014transform \u53EA\u6709\u4E00\u4E2A\uFF0C\u540C\u4E00\u4E2A\u5143\u7D20\u4E0A\u65E2\u8981\u8FC7\u6E21\u53C8\u8981\u52A8\u753B\u5C31\u4F1A\u4E92\u76F8\u8986\u76D6 -->
              <g class="dog-head-pose">
                <g class="dog-head-sway">
                <g class="dog-head">
                  <!-- \u8033\uFF1A\u7ACB\u8033\u3002\u4E2D\u534E\u7530\u56ED\u72AC\u7684\u6807\u5FD7\uFF0C\u4E5F\u662F\u8FD9\u53EA\u72D7\u6700\u6709\u8868\u60C5\u7684\u90E8\u4F4D -->
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

                  <!-- \u8138 -->
                  <path d="M100 38 C131 38 150 58 150 86 C150 112 130 130 100 130 C70 130 50 112 50 86 C50 58 69 38 100 38 Z"
                        fill="url(#${u}-head)" stroke="#4b4856" stroke-opacity="0.45" stroke-width="1.5"/>
                  <path d="M56 72 C60 52 77 41 96 39" fill="none" stroke="url(#${u}-rim)" stroke-width="3.4" stroke-linecap="round"/>
                  <!-- \u816E\u8FB9\u7684\u788E\u6BDB\uFF0C\u628A\u5706\u8138\u6253\u7834\u4E00\u70B9\uFF0C\u4E0D\u7136\u50CF\u718A -->
                  <path d="M52 96 L40 104 L54 111 Z" fill="url(#${u}-head)"/>
                  <path d="M148 96 L160 104 L146 111 Z" fill="url(#${u}-head)"/>

                  <!-- \u7709\uFF1A\u4E24\u64AE\u4EAE\u4E00\u70B9\u7684\u77ED\u6BDB\uFF0C\u8868\u60C5\u5168\u9760\u5B83 -->
                  <g class="dog-brows" stroke="#5a5663" stroke-width="3.2" stroke-linecap="round" fill="none">
                    <path d="M67 72 C71 66 82 65 87 70"/>
                    <path d="M133 72 C129 66 118 65 113 70"/>
                  </g>

                  <!-- \u773C\uFF1A\u9ED1\u72D7\u914D\u7425\u73C0\u77B3\uFF0C\u6DF1\u8272\u80CC\u666F\u4E0A\u624D\u6293\u5F97\u4F4F\u89C6\u7EBF -->
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
                    <!-- \u773C\u7751\uFF1A\u772F\u773C\u548C\u95ED\u773C\u7528\u753B\u7684\u5F27\u7EBF\uFF0C\u6BD4\u538B\u6241\u773C\u7403\u5E72\u51C0 -->
                    <g class="dog-lids" stroke="#0b0910" stroke-width="3.2" stroke-linecap="round" fill="none">
                      <path class="dog-lid dog-lid--squint" d="M68 87 C73 79 84 79 90 87"/>
                      <path class="dog-lid dog-lid--squint" d="M110 87 C116 79 127 79 132 87"/>
                      <path class="dog-lid dog-lid--sleep" d="M68 87 C73 94 84 94 90 87"/>
                      <path class="dog-lid dog-lid--sleep" d="M110 87 C116 94 127 94 132 87"/>
                    </g>

                    <!-- \u7728\u773C\u7528\u7684\u773C\u7751\uFF1A\u53EA\u6709 wink \u7684\u65F6\u5019\u624D\u9732\u51FA\u6765 -->
                    <g class="dog-wink-line" stroke="#0b0910" stroke-width="3.4" stroke-linecap="round" fill="none">
                      <path d="M112 89 C117 94 126 94 131 89"/>
                    </g>
                  </g>

                  <!-- \u543B\u90E8\uFF1A\u6BD4\u8138\u4EAE\u4E00\u6863\uFF0C\u72D7\u548C\u732B/\u718A\u7684\u5206\u754C\u7EBF\u5C31\u5728\u8FD9\u91CC -->
                  <ellipse cx="100" cy="114" rx="23.5" ry="17" fill="url(#${u}-snout)"/>
                  <path d="M84 105 C91 100 109 100 116 105" fill="none" stroke="#57506a" stroke-width="1.8" opacity="0.45" stroke-linecap="round"/>
                  <g fill="#55515e" opacity="0.5">
                    <circle cx="80" cy="115" r="1.1"/><circle cx="78" cy="120" r="1.1"/><circle cx="82" cy="123" r="1.1"/>
                    <circle cx="120" cy="115" r="1.1"/><circle cx="122" cy="120" r="1.1"/><circle cx="118" cy="123" r="1.1"/>
                  </g>

                  <!-- \u9F3B\uFF1A\u9ED1\u9F3B\u5934\uFF0C\u4E94\u9ED1\u91CC\u7684\u7B2C\u4E8C\u9ED1 -->
                  <path d="M88 99 C88 94 112 94 112 99 C112 106 106 111 100 111 C94 111 88 106 88 99 Z" fill="#0b0910"/>
                  <ellipse cx="95.5" cy="98.5" rx="4.6" ry="2.2" fill="#ffffff" opacity="0.32"/>

                  <!-- \u820C\uFF1A\u4E94\u9ED1\u8FDE\u820C\u5934\u90FD\u662F\u9ED1\u7684\uFF0C\u8FD9\u91CC\u7528\u4E4C\u6885\u8272\uFF0C\u660E\u6697\u4E3B\u9898\u90FD\u4E0D\u810F -->
                  <g class="dog-tongue">
                    <path d="M91 112 C91 121 109 121 109 112 C109 127 105 134 100 134 C95 134 91 127 91 112 Z"
                          fill="url(#${u}-tongue)"/>
                    <path d="M100 124 L100 131" stroke="#a35a74" stroke-width="1.5" opacity="0.55" stroke-linecap="round"/>
                  </g>

                  <!-- \u5634\uFF1A\u03C9 \u5F62\u538B\u5728\u820C\u5934\u4E0A\uFF0C\u628A\u820C\u5934"\u6302"\u4F4F -->
                  <path d="M100 111 C100 117 95 120 91 117" fill="none" stroke="#171220" stroke-width="2.6" stroke-linecap="round"/>
                  <path d="M100 111 C100 117 105 120 109 117" fill="none" stroke="#171220" stroke-width="2.6" stroke-linecap="round"/>
                </g>
                </g>
              </g>

              <!-- \u7B49\u5F85\u786E\u8BA4\u7684\u6696\u8272\u5149\u73AF -->
              <circle class="dog-ring" cx="100" cy="96" r="72" fill="none" stroke="#ffb84c" stroke-width="2.5"/>

              <!-- \u6253\u76F9\u7684 zZz -->
              <g class="dog-zzz" fill="#a79fc6" font-size="13" font-weight="700" font-family="system-ui, sans-serif">
                <text class="dog-zzz__a" x="152" y="64">z</text>
                <text class="dog-zzz__b" x="164" y="46">Z</text>
              </g>
            </g>
          </g>
        </g>
      </svg>`;
      }

      // src/config.js
      var STORAGE_KEY = "dsh-mascot:config";
      var DEFAULT_CONFIG = {
        displayName: "\u9ED1\u8C46",
        scale: 1,
        showBubble: true,
        docked: true,
        modelUrl: ""
      };
      function loadConfig() {
        if (typeof window === "undefined") return { ...DEFAULT_CONFIG };
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (!raw) return { ...DEFAULT_CONFIG };
          const stored = JSON.parse(raw);
          return { ...DEFAULT_CONFIG, ...stored };
        } catch {
          return { ...DEFAULT_CONFIG };
        }
      }
      function saveConfig(patch) {
        const next = { ...loadConfig(), ...patch };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
        }
        return next;
      }

      // src/look-at.js
      var MAX_ANGLE = 30;
      function toGaze(clientX, clientY, rect) {
        const halfWidth = Math.max(rect.width / 2, 1);
        const halfHeight = Math.max(rect.height / 2, 1);
        const x = clamp((clientX - (rect.left + halfWidth)) / halfWidth);
        const y = clamp((rect.top + halfHeight - clientY) / halfHeight);
        return { x, y };
      }
      function clamp(value) {
        return Math.min(1, Math.max(-1, value));
      }
      function attachLookAt(model, getRect) {
        let frame = 0;
        function onMove(event) {
          if (frame) return;
          frame = window.requestAnimationFrame(() => {
            frame = 0;
            const core = model?.internalModel?.coreModel;
            if (typeof core?.setParameterValueById !== "function") return;
            const { x, y } = toGaze(event.clientX, event.clientY, getRect());
            core.setParameterValueById("ParamAngleX", x * MAX_ANGLE);
            core.setParameterValueById("ParamAngleY", y * MAX_ANGLE);
            core.setParameterValueById("ParamAngleZ", x * MAX_ANGLE * 0.3);
            core.setParameterValueById("ParamEyeBallX", x);
            core.setParameterValueById("ParamEyeBallY", y);
          });
        }
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => {
          window.removeEventListener("mousemove", onMove);
          if (frame) window.cancelAnimationFrame(frame);
        };
      }
      function attachGazeToElement(el, getRect) {
        let frame = 0;
        let latest = null;
        function onMove(event) {
          latest = event;
          if (frame) return;
          frame = window.requestAnimationFrame(() => {
            frame = 0;
            if (!latest) return;
            const { x, y } = toGaze(latest.clientX, latest.clientY, getRect());
            el.style.setProperty("--gaze-x", x.toFixed(3));
            el.style.setProperty("--gaze-y", y.toFixed(3));
          });
        }
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => {
          window.removeEventListener("mousemove", onMove);
          if (frame) window.cancelAnimationFrame(frame);
        };
      }

      // src/model-loader.js
      var RUNTIME_MISSING = "\u672A\u68C0\u6D4B\u5230 Live2D \u8FD0\u884C\u65F6\uFF1Awindow.PIXI.live2d \u4E0D\u5B58\u5728";
      var PLUGIN_BASE = (() => {
        const script = typeof document === "undefined" ? null : (
          /** @type {HTMLScriptElement | null} */
          document.currentScript
        );
        const src = script?.src ?? "";
        try {
          return src ? new URL(".", src).href : new URL(".", location.href).href;
        } catch {
          return "";
        }
      })();
      var STAGE_WIDTH = 220;
      var STAGE_HEIGHT = 280;
      function getPIXI() {
        return (
          /** @type {any} */
          globalThis.PIXI
        );
      }
      function hasLive2DRuntime() {
        const PIXI = getPIXI();
        return Boolean(PIXI?.Application && PIXI?.live2d?.Live2DModel);
      }
      async function fetchModelManifest(url = `${PLUGIN_BASE}assets/models.json`) {
        try {
          const response = await fetch(url, { credentials: "same-origin" });
          if (!response.ok) return [];
          const data = await response.json();
          if (!Array.isArray(data.models)) return [];
          return data.models.map((model) => ({
            ...model,
            url: absolute(model.url)
          }));
        } catch {
          return [];
        }
      }
      function absolute(path) {
        try {
          return new URL(path, PLUGIN_BASE).href;
        } catch {
          return path;
        }
      }
      async function mountLive2D(container, url) {
        if (!hasLive2DRuntime()) throw new Error(RUNTIME_MISSING);
        const PIXI = getPIXI();
        const app = new PIXI.Application({
          backgroundAlpha: 0,
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(window.devicePixelRatio || 1, 2)
        });
        const view = (
          /** @type {HTMLCanvasElement} */
          app.view
        );
        view.className = "dsh-mascot__canvas";
        container.appendChild(view);
        try {
          const model = await PIXI.live2d.Live2DModel.from(url, { autoInteract: false });
          model.anchor?.set?.(0.5, 1);
          model.position.set(STAGE_WIDTH / 2, STAGE_HEIGHT);
          model.scale.set(1);
          app.stage.addChild(model);
          return {
            model,
            destroy() {
              view.remove();
              app.destroy(true, { children: true });
            }
          };
        } catch (error) {
          view.remove();
          app.destroy(true, { children: true });
          throw error;
        }
      }

      // src/settings.js
      function createSettingsPanel({ config, models, onPatch, onClose }) {
        const panel = document.createElement("div");
        panel.className = "dsh-mascot__panel";
        panel.setAttribute("role", "dialog");
        panel.setAttribute("aria-label", "\u677F\u5A18\u8BBE\u7F6E");
        const title = document.createElement("div");
        title.className = "dsh-mascot__panel-title";
        title.textContent = "\u677F\u5A18\u8BBE\u7F6E";
        const close = document.createElement("button");
        close.type = "button";
        close.className = "dsh-mascot__panel-close";
        close.textContent = "\xD7";
        close.title = "\u5173\u95ED";
        close.addEventListener("click", onClose);
        title.appendChild(close);
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = config.displayName;
        nameInput.className = "dsh-mascot__input";
        nameInput.addEventListener("change", () => {
          onPatch({ displayName: nameInput.value.trim() || "\u677F\u5A18" });
        });
        const scaleInput = document.createElement("input");
        scaleInput.type = "range";
        scaleInput.min = "0.6";
        scaleInput.max = "1.6";
        scaleInput.step = "0.05";
        scaleInput.value = String(config.scale);
        scaleInput.addEventListener("input", () => {
          onPatch({ scale: Number(scaleInput.value) });
        });
        const bubbleInput = document.createElement("input");
        bubbleInput.type = "checkbox";
        bubbleInput.checked = config.showBubble;
        bubbleInput.addEventListener("change", () => {
          onPatch({ showBubble: bubbleInput.checked });
        });
        const modelInput = document.createElement("input");
        modelInput.type = "text";
        modelInput.value = config.modelUrl;
        modelInput.className = "dsh-mascot__input";
        modelInput.placeholder = "https://\u2026/xxx.model3.json\uFF08\u7559\u7A7A\u7528\u5185\u7F6E\u7ACB\u7ED8\uFF09";
        modelInput.setAttribute("list", "dsh-mascot-models");
        modelInput.addEventListener("change", () => {
          onPatch({ modelUrl: modelInput.value.trim() });
        });
        panel.append(
          title,
          row("\u79F0\u547C", nameInput),
          row("\u7F29\u653E", scaleInput),
          row("\u6C14\u6CE1", bubbleInput),
          row("\u6A21\u578B", modelInput)
        );
        if (models.length > 0) {
          const list = document.createElement("datalist");
          list.id = "dsh-mascot-models";
          for (const model of models) {
            const option = document.createElement("option");
            option.value = model.url;
            option.textContent = model.label;
            list.appendChild(option);
          }
          panel.appendChild(list);
        }
        const hint = document.createElement("p");
        hint.className = "dsh-mascot__hint";
        hint.textContent = "\u6A21\u578B\u5730\u5740\u9700\u8981\u53EF\u8DE8\u57DF\u8BBF\u95EE\uFF1B\u5185\u7F6E\u6A21\u578B\u8981\u5148\u8BA9\u5BBF\u4E3B\u628A assets/ \u6302\u51FA\u6765\u3002";
        panel.appendChild(hint);
        return panel;
      }
      function row(labelText, control) {
        const wrapper = document.createElement("label");
        wrapper.className = "dsh-mascot__row";
        const span = document.createElement("span");
        span.textContent = labelText;
        wrapper.append(span, control);
        return wrapper;
      }

      // src/state.js
      var IDLE_SLEEP_MS = 5 * 60 * 1e3;
      var MOOD_LABEL = {
        idle: "\u5F85\u673A",
        working: "\u966A\u4F60\u5E72\u6D3B",
        waiting: "\u7B49\u4F60\u786E\u8BA4",
        sleepy: "\u6253\u76F9",
        happy: "\u5F00\u5FC3"
      };
      var GREETINGS = [
        "\u6C6A\uFF01",
        "\u5728\u7684\uFF0C\u7EE7\u7EED\u5427\u3002",
        "\u8FD9\u6BB5\u4EE3\u7801\u6211\u95FB\u4E86\u95FB\u2026\u2026\u6CA1\u95FB\u61C2\u3002",
        "\u8981\u4E0D\u8981\u5148\u8DD1\u4E2A\u6D4B\u8BD5\uFF1F",
        "\u522B\u71AC\u592A\u665A\uFF0C\u6211\u5148\u8DB4\u4F1A\u513F\u3002",
        "\u6478\u6478\u5934\u5C31\u7EE7\u7EED\u5E72\u6D3B\u3002"
      ];
      function resolveMood(signal, now = Date.now()) {
        if (signal.awaitingApproval) return "waiting";
        if (signal.running) return "working";
        const lastActivityAt = signal.lastActivityAt;
        if (typeof lastActivityAt === "number" && now - lastActivityAt >= IDLE_SLEEP_MS) return "sleepy";
        return "idle";
      }
      function pickGreeting(random = Math.random) {
        const index = Math.min(Math.floor(random() * GREETINGS.length), GREETINGS.length - 1);
        return GREETINGS[index] ?? GREETINGS[0] ?? "";
      }

      // src/styles.js
      var STYLE_ID = "dsh-mascot-styles";
      var MASCOT_CSS = `
      /* ---------------- \u5916\u58F3 ---------------- */
      .dsh-mascot-anchor {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 60;
      }

      .dsh-mascot {
        /* \u6D6E\u5C42\u5361\u7247\u7684\u4E2D\u6027\u914D\u8272\u3002data-theme \u7531 theme.js \u6309\u5BBF\u4E3B\u754C\u9762\u5224\u5B9A\u540E\u5199\u5728\u6839\u8282\u70B9\u4E0A */
        --mascot-surface: rgba(255, 255, 255, 0.94);
        --mascot-text: #1f2328;
        --mascot-line: rgba(15, 23, 42, 0.14);
        --mascot-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);

        /* \u59FF\u6001\u56DE\u5F39\u7684\u7F13\u52A8\uFF1A\u5E26\u4E00\u70B9\u8FC7\u51B2\uFF0C\u5C0F\u52A8\u7269\u7684\u52A8\u4F5C\u624D\u4E0D\u4F1A\u50CF\u673A\u68B0\u81C2 */
        --ease-pose: cubic-bezier(0.34, 1.28, 0.58, 1);

        position: absolute;
        right: 24px;
        bottom: 0;
        display: flex;
        align-items: flex-end;
        gap: 10px;
        transform: scale(var(--dsh-mascot-scale, 1));
        transform-origin: bottom right;
        pointer-events: none;
        user-select: none;
        font-family: inherit;
        font-size: 13px;
        line-height: 1.5;
        color: var(--mascot-text);
      }

      .dsh-mascot[data-theme='dark'] {
        --mascot-surface: rgba(32, 35, 42, 0.96);
        --mascot-text: #e8eaee;
        --mascot-line: rgba(255, 255, 255, 0.14);
        --mascot-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
      }

      /* \u515C\u5E95\uFF1Atheme.js \u6CA1\u8DD1\u8D77\u6765\uFF08\u4F8B\u5982\u88AB CSP \u62E6\u4E86 inline script\uFF09\u65F6\u4E5F\u4E0D\u81F3\u4E8E\u914D\u8272\u9519\u4E71 */
      @media (prefers-color-scheme: dark) {
        .dsh-mascot:not([data-theme]) {
          --mascot-surface: rgba(32, 35, 42, 0.96);
          --mascot-text: #e8eaee;
          --mascot-line: rgba(255, 255, 255, 0.14);
          --mascot-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
        }
      }

      .dsh-mascot__stage {
        position: relative;
        pointer-events: auto;
      }

      .dsh-mascot__body {
        display: block;
        width: 168px;
        height: 168px;
        padding: 0;
        border: 0;
        background: none;
        color: inherit;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      .dsh-mascot__body[hidden] { display: none; }

      .dsh-mascot__body:focus-visible {
        outline: 2px solid #6f9df0;
        outline-offset: 4px;
        border-radius: 12px;
      }

      .dsh-mascot__canvas {
        display: block;
        width: 220px;
        height: 280px;
      }

      /* ---------------- \u7ACB\u7ED8 ---------------- */
      .dsh-mascot__art {
        width: 168px;
        height: 168px;
        transition: transform 180ms ease-out, filter 260ms ease-out;
      }

      .dsh-mascot__stage:hover .dsh-mascot__art { transform: translateY(-3px); }

      .dsh-mascot__svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      /* \u6240\u6709\u4F1A\u52A8\u7684\u7EC4\u90FD\u8981 fill-box\uFF0C\u5426\u5219 transform-origin \u7684\u767E\u5206\u6BD4\u662F\u6309\u89C6\u53E3\u7B97\u7684 */
      .dog-hop,
      .dog-pose,
      .dog-breathe,
      .dog-head-pose,
      .dog-head-sway,
      .dog-head,
      .dog-ear,
      .dog-tail-pose,
      .dog-tail-wag,
      .dog-hind,
      .dog-leg-l,
      .dog-leg-r,
      .dog-eye,
      .dog-eye-pose,
      .dog-tongue { transform-box: fill-box; }

      /* \u5F85\u673A\u547C\u5438\uFF1A\u6574\u4F53\u8D77\u4F0F\uFF0C\u5934\u8EAB\u4E00\u8D77\u52A8\u624D\u4E0D\u6563\u67B6 */
      .dog-breathe {
        transform-origin: 50% 100%;
        animation: dog-breathe 4.6s ease-in-out infinite;
      }

      /* \u59FF\u6001\u5C42\uFF1A\u6574\u53EA\u72D7\u7684\u4F4D\u79FB\u4E0E\u5F62\u53D8 */
      .dog-pose {
        transform: var(--p-root, none);
        transform-origin: 50% 100%;
        transition: transform 520ms var(--ease-pose);
      }

      /* \u5934\uFF1A\u59FF\u6001 \u2192 \u5F85\u673A\u5FAE\u6643 \u2192 \u8DDF\u9F20\u6807\u3002\u4E09\u5C42\u5FC5\u987B\u662F\u4E09\u4E2A\u5143\u7D20\uFF0Ctransform \u53EA\u6709\u4E00\u4E2A */
      .dog-head-pose {
        transform: var(--p-head, none);
        transform-origin: 50% 94%;
        transition: transform 460ms var(--ease-pose);
      }

      .dog-head-sway {
        transform-origin: 50% 96%;
        animation: dog-sway 6.4s ease-in-out infinite;
      }

      .dog-head {
        transform:
          translate(calc(var(--gaze-x, 0) * 2.4px), calc(var(--gaze-y, 0) * -2px))
          rotate(calc(var(--gaze-x, 0) * 3deg));
        transition: transform 200ms ease-out;
      }

      /* \u8033\uFF1A\u7ACB\u8033\u4F1A\u968F\u60C5\u7EEA\u524D\u538B\u6216\u540E\u5012\uFF0C\u8FD9\u662F\u72D7\u6700\u6709\u8868\u60C5\u7684\u90E8\u4F4D */
      .dog-ear { transform-origin: 50% 100%; transition: transform 340ms var(--ease-pose); }
      .dog-ear--l { transform: var(--p-ear-l, none); }
      .dog-ear--r { transform: var(--p-ear-r, none); }

      /* \u5C3E\uFF1A\u59FF\u6001\u8D1F\u8D23"\u62AC\u591A\u9AD8"\uFF0C\u5173\u952E\u5E27\u8D1F\u8D23"\u6447" */
      .dog-tail-pose {
        transform: var(--p-tail, none);
        transform-origin: 14% 86%;
        transition: transform 420ms var(--ease-pose);
      }

      .dog-tail-wag {
        transform-origin: 14% 90%;
        animation: dog-wag 2.1s ease-in-out infinite;
      }

      .dog-hind {
        transform: var(--p-hind, none);
        transform-origin: 50% 92%;
        transition: transform 460ms var(--ease-pose);
      }

      .dog-leg-l,
      .dog-leg-r {
        transform-origin: 50% 5%;
        transition: transform 460ms var(--ease-pose);
      }

      .dog-leg-l { transform: var(--p-leg-l, none); }
      .dog-leg-r { transform: var(--p-leg-r, none); }

      /* \u773C\uFF1A\u59FF\u6001\uFF08\u772F/\u95ED\uFF09\u5728\u5916\u5C42\uFF0C\u8DDF\u9F20\u6807\u5728\u5185\u5C42 */
      .dog-eye-pose {
        transform: var(--p-eye, none);
        transform-origin: 50% 50%;
        transition: transform 320ms var(--ease-pose);
      }

      .dog-eyes {
        transform-origin: 50% 50%;
        animation: dog-blink 5.4s ease-in-out infinite;
      }

      .dog-eye {
        transform: translate(calc(var(--gaze-x, 0) * 1.7px), calc(var(--gaze-y, 0) * -1.4px));
        transition: transform 120ms linear, opacity 140ms linear;
      }

      .dog-eye.dog-eye--r {
        transform: var(--p-eye-r, none) translate(calc(var(--gaze-x, 0) * 1.7px), calc(var(--gaze-y, 0) * -1.4px));
        transition: transform 220ms var(--ease-pose), opacity 140ms linear;
      }

      .dog-wink-line { opacity: 0; transition: opacity 120ms linear; }

      /* \u773C\u7751\u5F27\uFF1A\u772F\u773C / \u95ED\u773C\u76F4\u63A5\u7528\u753B\u7684\u7EBF\uFF0C\u6BD4\u628A\u773C\u7403\u538B\u6241\u5E72\u51C0 \u2014\u2014 \u538B\u6241\u4F1A\u7559\u4E00\u6761\u7425\u73C0\u8272\u7EC6\u7F1D */
      .dog-lid { opacity: 0; transition: opacity 140ms linear; }

      .dog-tongue {
        transform: var(--p-tongue, none);
        transform-origin: 50% 4%;
        transition: transform 340ms var(--ease-pose);
      }

      /* \u7B49\u5F85\u786E\u8BA4\uFF1A\u7425\u73C0\u5149\u73AF\u8109\u51B2 */
      .dog-ring {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: 50% 50%;
      }

      /* \u6253\u76F9\uFF1A\u98D8\u51FA\u6765\u7684 zZz */
      .dog-zzz { opacity: 0; transition: opacity 260ms linear; }

      /* ---------------- \u59FF\u6001 ---------------- */
      /* \u5750\u7740\uFF1A\u57FA\u51C6\u59FF\u6001\uFF0C\u6240\u6709\u53D8\u91CF\u90FD\u662F\u9ED8\u8BA4\u503C\uFF0C\u4E0D\u9700\u8981\u989D\u5916\u58F0\u660E */

      /* \u4F38\u61D2\u8170\uFF1A\u7AD9\u8D77\u6765\u5F80\u4E0A\u6491\uFF0C\u773C\u775B\u772F\u7740\uFF0C\u820C\u5934\u4F38\u51FA\u6765\u4E00\u70B9 */
      .dsh-mascot[data-act='stretch'] .dog-eye { opacity: 0; }
      .dsh-mascot[data-act='stretch'] .dog-lid--squint { opacity: 1; }

      .dsh-mascot[data-act='stretch'] {
        --p-root: translateY(-5px) scaleY(1.06);
        --p-head: translateY(-7px) rotate(-3deg);
        --p-leg-l: rotate(3deg) translateY(-3px);
        --p-leg-r: rotate(-3deg) translateY(-3px);
        --p-hind: translateY(-5px);
        --p-tail: rotate(-18deg);
        --p-tongue: scaleY(1.25);
        --p-ear-l: rotate(-6deg);
        --p-ear-r: rotate(6deg);
      }

      /* \u4E0B\u72AC\u5F0F\uFF1A\u524D\u4F4E\u540E\u9AD8\uFF0C\u5C41\u80A1\u6485\u8D77\u6765\uFF0C\u5C3E\u5DF4\u7FD8\u5230\u6700\u9AD8 */
      .dsh-mascot[data-act='bow'] {
        --p-root: scaleY(0.9);
        --p-head: translateY(15px) scale(1.02);
        --p-leg-l: rotate(-13deg) translate(1px, 3px);
        --p-leg-r: rotate(13deg) translate(-1px, 3px);
        --p-hind: translateY(-16px) scaleY(1.14);
        --p-tail: rotate(-42deg);
        --p-ear-l: rotate(-15deg);
        --p-ear-r: rotate(15deg);
        --p-tongue: translateY(2px) scaleY(1.5);
      }

      /* wink\uFF1A\u5934\u4E00\u6B6A\uFF0C\u53F3\u773C\u95ED\u4E0A\uFF0C\u4E00\u6761\u773C\u7751\u7EBF\u8865\u4E0A\u95ED\u5408\u7684\u5F27\u5EA6 */
      .dsh-mascot[data-act='wink'] {
        --p-root: translateY(-2px);
        --p-head: translateY(-3px) rotate(-8deg);
        --p-tail: rotate(-26deg);
        --p-tongue: scaleY(1.35);
        --p-ear-l: rotate(-10deg);
        --p-ear-r: rotate(4deg);
      }

      .dsh-mascot[data-act='wink'] .dog-eye--r { opacity: 0; }
      .dsh-mascot[data-act='wink'] .dog-wink-line { opacity: 1; }

      /* \u8DF3\uFF1A\u5F62\u53D8\u4EA4\u7ED9 .dog-hop \u7684\u5173\u952E\u5E27\uFF0C\u8FD9\u91CC\u53EA\u8C03\u6574\u96F6\u4EF6\u671D\u5411 */
      .dsh-mascot[data-act='jump'] {
        --p-leg-l: rotate(8deg);
        --p-leg-r: rotate(-8deg);
        --p-hind: translateY(4px);
        --p-tail: rotate(-30deg);
        --p-ear-l: rotate(-12deg);
        --p-ear-r: rotate(12deg);
        --p-tongue: translateY(1px) scaleY(1.45);
      }

      .dsh-mascot[data-act='jump'] .dog-hop {
        transform-origin: 50% 100%;
        animation: dog-hop 1200ms var(--ease-pose) both;
      }

      .dsh-mascot[data-act='jump'] .dog-shadow {
        transform-box: fill-box;
        transform-origin: 50% 50%;
        animation: dog-shadow-hop 1200ms var(--ease-pose) both;
      }

      /* \u6253\u76F9\uFF1A\u6574\u53EA\u8DB4\u4E0B\u53BB\uFF0C\u8033\u540E\u5012\uFF0C\u5C3E\u5DF4\u6536\u5230\u8EAB\u8FB9\uFF0C\u773C\u775B\u95ED\u6B7B */
      .dsh-mascot[data-act='nap'] {
        --p-root: scaleY(0.84) rotate(-2deg);
        --p-head: translateY(13px) rotate(6deg) scale(0.97);
        --p-ear-l: rotate(26deg);
        --p-ear-r: rotate(-26deg);
        --p-tail: rotate(22deg) scale(0.86);
        --p-hind: translateY(8px);
        --p-leg-l: rotate(-4deg) translateY(6px);
        --p-leg-r: rotate(4deg) translateY(6px);
      }

      .dsh-mascot[data-act='nap'] .dog-eyes { animation: none; }
      .dsh-mascot[data-act='nap'] .dog-eye { opacity: 0; }
      .dsh-mascot[data-act='nap'] .dog-lid--sleep { opacity: 1; }
      .dsh-mascot[data-act='nap'] .dog-zzz { opacity: 1; }
      .dsh-mascot[data-act='nap'] .dog-zzz__a { animation: dog-zzz 3.2s ease-in-out infinite; }
      .dsh-mascot[data-act='nap'] .dog-zzz__b { animation: dog-zzz 3.2s ease-in-out 1.1s infinite; }
      .dsh-mascot[data-act='nap'] .dog-breathe { animation-duration: 7.4s; }

      /* \u7B49\u4F60\u786E\u8BA4\uFF1A\u62AC\u5934\u3001\u7AD6\u8033\u3001\u5C3E\u5DF4\u538B\u4F4E\u84C4\u52BF */
      .dsh-mascot[data-act='alert'] {
        --p-root: translateY(-3px) scaleY(1.03);
        --p-head: translateY(-7px) rotate(-2deg);
        --p-ear-l: rotate(-7deg);
        --p-ear-r: rotate(7deg);
        --p-tail: rotate(-14deg);
      }

      /* ---------------- \u60C5\u7EEA ---------------- */
      .dsh-mascot[data-mood='working'] .dog-breathe { animation-duration: 2.8s; }
      .dsh-mascot[data-mood='working'] .dog-tail-wag { animation-duration: 1.1s; }
      .dsh-mascot[data-mood='working'] .dog-eyes { animation-duration: 3.6s; }

      .dsh-mascot[data-mood='happy'] .dog-tail-wag { animation-duration: 0.42s; }

      .dsh-mascot[data-mood='waiting'] .dog-ring {
        animation: dog-ring 1.8s ease-out infinite;
      }

      /* \u5149\u73AF\u662F"\u626B\u8FC7\u53BB"\u7684\uFF0C\u5355\u9760\u5B83\u5BB9\u6613\u6F0F\u770B\uFF0C\u518D\u53E0\u4E00\u5C42\u5E38\u4EAE\u7684\u6696\u8272\u63CF\u8FB9 */
      .dsh-mascot[data-mood='waiting'] .dsh-mascot__art {
        filter: drop-shadow(0 0 9px rgba(255, 184, 76, 0.5));
      }

      .dsh-mascot[data-mood='waiting'] .dog-tail-wag { animation-duration: 0.9s; }

      .dsh-mascot[data-mood='sleepy'] .dog-tail-wag { animation-duration: 4.2s; }

      /* ---------------- \u6C14\u6CE1 ---------------- */
      /* \u8D34\u5728\u5934\u9876\u800C\u4E0D\u662F\u811A\u8FB9\uFF1A\u6C14\u6CE1\u662F"\u5B83\u5728\u8BF4\u8BDD"\uFF0C\u4F4D\u7F6E\u5FC5\u987B\u9760\u8FD1\u8138 */
      .dsh-mascot__bubble {
        position: relative;
        align-self: flex-start;
        margin-top: 12px;
        max-width: 190px;
        padding: 8px 12px;
        border-radius: 12px 12px 4px 12px;
        background: var(--mascot-surface);
        border: 1px solid var(--mascot-line);
        box-shadow: var(--mascot-shadow);
        animation: mascot-pop 180ms ease-out;
      }

      .dsh-mascot__bubble::after {
        content: '';
        position: absolute;
        right: 10px;
        bottom: -6px;
        width: 10px;
        height: 10px;
        background: var(--mascot-surface);
        border-right: 1px solid var(--mascot-line);
        border-bottom: 1px solid var(--mascot-line);
        border-radius: 0 0 3px 0;
        transform: rotate(45deg);
      }

      .dsh-mascot__bubble[hidden] { display: none; }

      /* ---------------- \u9F7F\u8F6E\u4E0E\u9762\u677F ---------------- */
      .dsh-mascot__gear {
        position: absolute;
        right: 2px;
        top: 4px;
        width: 22px;
        height: 22px;
        padding: 0;
        border: 1px solid rgba(127, 127, 127, 0.28);
        border-radius: 50%;
        background: rgba(127, 127, 127, 0.12);
        color: inherit;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        pointer-events: auto;
        /* \u4E0D\u80FD\u7528 opacity: 0 \u5E38\u9A7B\uFF1A\u89E6\u5C4F\u8BBE\u5907\u6CA1\u6709 hover\uFF0C\u7B49\u4E8E\u628A\u8BBE\u7F6E\u5165\u53E3\u85CF\u6B7B\u4E86\u3002
           \u7ED9\u4E00\u4E2A\u591F\u6DE1\u4F46\u59CB\u7EC8\u53EF\u70B9\u7684\u9ED8\u8BA4\u6001\uFF0C\u60AC\u505C/\u805A\u7126\u65F6\u518D\u63D0\u4EAE\u3002 */
        opacity: 0.42;
        transition: opacity 140ms ease-out;
      }

      .dsh-mascot:hover .dsh-mascot__gear,
      .dsh-mascot__gear:focus-visible { opacity: 1; }

      .dsh-mascot__panel {
        position: absolute;
        /* \u5F80\u5DE6\u5F00\u3001\u5F80\u4E0A\u62AC\uFF1A\u4E0D\u8981\u76D6\u4F4F\u7ACB\u7ED8\uFF0C\u4E5F\u4E0D\u8981\u538B\u4F4F\u8F93\u5165\u6846 \u2014\u2014 \u538B\u5728\u8F93\u5165\u6846\u4E0A\u7B49\u4E8E\u628A\u4EBA\u9501\u5728\u95E8\u5916 */
        right: calc(100% + 10px);
        bottom: calc(100% + 8px);
        width: 248px;
        max-height: min(64vh, 460px);
        overflow-y: auto;
        overscroll-behavior: contain;
        padding: 12px;
        border-radius: 14px;
        background: var(--mascot-surface);
        border: 1px solid var(--mascot-line);
        box-shadow: var(--mascot-shadow);
        pointer-events: auto;
        display: grid;
        gap: 8px;
        font-size: 12px;
      }

      .dsh-mascot__panel-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 600;
      }

      .dsh-mascot__panel-close {
        border: none;
        background: transparent;
        color: inherit;
        font-size: 14px;
        cursor: pointer;
        opacity: 0.6;
      }

      .dsh-mascot__row {
        display: grid;
        grid-template-columns: 40px 1fr;
        align-items: center;
        gap: 8px;
        opacity: 0.9;
      }

      .dsh-mascot__input {
        width: 100%;
        padding: 4px 6px;
        border: 1px solid var(--mascot-line);
        border-radius: 6px;
        background: color-mix(in srgb, currentColor 6%, transparent);
        color: inherit;
        font: inherit;
      }

      .dsh-mascot__hint {
        margin: 0;
        font-size: 11px;
        opacity: 0.55;
        line-height: 1.4;
      }

      /* ---------------- \u5173\u952E\u5E27 ---------------- */
      @keyframes dog-breathe {
        0%, 100% { transform: scale(1, 1); }
        50% { transform: scale(1.012, 1.028); }
      }

      @keyframes dog-sway {
        0%, 100% { transform: rotate(-1.1deg) translateY(0); }
        50% { transform: rotate(1.1deg) translateY(-1.2px); }
      }

      @keyframes dog-blink {
        0%, 92%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.06); }
        97% { transform: scaleY(1); }
      }

      @keyframes dog-wag {
        0%, 100% { transform: rotate(-9deg); }
        50% { transform: rotate(12deg); }
      }

      @keyframes dog-hop {
        0% { transform: translateY(0) scale(1, 1); }
        16% { transform: translateY(5px) scale(1.07, 0.9); }
        38% { transform: translateY(-28px) scale(0.95, 1.09); }
        58% { transform: translateY(-6px) scale(0.99, 1.02); }
        76% { transform: translateY(4px) scale(1.06, 0.93); }
        100% { transform: translateY(0) scale(1, 1); }
      }

      @keyframes dog-shadow-hop {
        0%, 100% { transform: scale(1); opacity: 0.26; }
        38% { transform: scale(0.72); opacity: 0.12; }
        76% { transform: scale(1.04); opacity: 0.28; }
      }

      @keyframes dog-ring {
        0% { opacity: 0.75; transform: scale(0.86); }
        75% { opacity: 0; transform: scale(1.08); }
        100% { opacity: 0; transform: scale(1.08); }
      }

      @keyframes dog-zzz {
        0% { opacity: 0; transform: translateY(6px) scale(0.92); }
        25% { opacity: 0.85; }
        75% { opacity: 0.85; }
        100% { opacity: 0; transform: translateY(-10px) scale(1.06); }
      }

      @keyframes mascot-pop {
        from { opacity: 0; transform: translateY(6px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .dog-breathe,
        .dog-head-sway,
        .dog-eyes,
        .dog-tail-wag,
        .dog-hop,
        .dog-shadow,
        .dog-ring,
        .dog-zzz__a,
        .dog-zzz__b,
        .dsh-mascot__art,
        .dsh-mascot__bubble {
          animation: none !important;
        }
        .dog-pose,
        .dog-head-pose,
        .dog-ear,
        .dog-tail-pose,
        .dog-hind,
        .dog-leg-l,
        .dog-leg-r,
        .dog-eye-pose,
        .dog-eye,
        .dog-tongue,
        .dog-head { transition: none !important; }
      }

      @media (max-width: 720px) {
        .dsh-mascot { right: 12px; bottom: 10px; }
        .dsh-mascot__body,
        .dsh-mascot__art { width: 126px; height: 126px; }
        .dsh-mascot__canvas { width: 150px; height: 190px; }
        .dsh-mascot__bubble { max-width: 150px; margin-top: 8px; }
      }
      `;
      function injectStyles() {
        if (document.getElementById(STYLE_ID)) return () => {
        };
        const style = document.createElement("style");
        style.id = STYLE_ID;
        style.textContent = MASCOT_CSS;
        document.head.appendChild(style);
        return () => style.remove();
      }

      // src/theme.js
      var DARK_THRESHOLD = 0.45;
      function parseColor(color) {
        const text = color.trim();
        if (!text) return null;
        if (text.startsWith("#")) {
          const hex = text.slice(1);
          if (hex.length === 3) {
            const r2 = Number.parseInt(hex.slice(0, 1).repeat(2), 16);
            const g2 = Number.parseInt(hex.slice(1, 2).repeat(2), 16);
            const b2 = Number.parseInt(hex.slice(2, 3).repeat(2), 16);
            return Number.isNaN(r2) || Number.isNaN(g2) || Number.isNaN(b2) ? null : { r: r2, g: g2, b: b2, a: 1 };
          }
          if (hex.length === 6 || hex.length === 8) {
            const r2 = Number.parseInt(hex.slice(0, 2), 16);
            const g2 = Number.parseInt(hex.slice(2, 4), 16);
            const b2 = Number.parseInt(hex.slice(4, 6), 16);
            const a2 = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1;
            return Number.isNaN(r2) || Number.isNaN(g2) || Number.isNaN(b2) || Number.isNaN(a2) ? null : { r: r2, g: g2, b: b2, a: a2 };
          }
          return null;
        }
        const match = text.match(/^rgba?\(([^)]+)\)$/i);
        const body = match?.[1];
        if (!body) return null;
        const parts = body.split(/[,/\s]+/).filter(Boolean);
        const [rawR = "", rawG = "", rawB = "", rawA] = parts;
        if (!rawR || !rawG || !rawB) return null;
        const channel = (raw) => {
          if (raw.endsWith("%")) return Number.parseFloat(raw) / 100 * 255;
          return Number.parseFloat(raw);
        };
        const r = channel(rawR);
        const g = channel(rawG);
        const b = channel(rawB);
        const a = rawA === void 0 ? 1 : rawA.endsWith("%") ? Number.parseFloat(rawA) / 100 : Number.parseFloat(rawA);
        if ([r, g, b, a].some((value) => Number.isNaN(value))) return null;
        return { r, g, b, a };
      }
      function luminance(color) {
        return (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
      }
      function detectTheme(doc = document) {
        const fallback = prefersDark(doc) ? "dark" : "light";
        const view = doc.defaultView;
        if (!view) return fallback;
        let node = doc.body;
        while (node) {
          const background = parseColor(view.getComputedStyle(node).backgroundColor);
          if (background && background.a >= 0.2) {
            return luminance(background) < DARK_THRESHOLD ? "dark" : "light";
          }
          node = node.parentElement;
        }
        return fallback;
      }
      function watchTheme(callback, doc = document) {
        const view = doc.defaultView;
        if (!view) return () => {
        };
        let last = detectTheme(doc);
        let frame = 0;
        const check = () => {
          frame = 0;
          const next = detectTheme(doc);
          if (next === last) return;
          last = next;
          callback(next);
        };
        const observer = new MutationObserver(() => {
          if (frame) return;
          frame = view.requestAnimationFrame(check);
        });
        for (const target of [doc.documentElement, doc.body]) {
          if (!target) continue;
          observer.observe(target, {
            attributes: true,
            attributeFilter: ["class", "style", "data-theme"]
          });
        }
        const media = view.matchMedia("(prefers-color-scheme: dark)");
        media.addEventListener("change", check);
        return () => {
          observer.disconnect();
          media.removeEventListener("change", check);
          if (frame) view.cancelAnimationFrame(frame);
        };
      }
      function prefersDark(doc) {
        const view = doc.defaultView;
        return view ? view.matchMedia("(prefers-color-scheme: dark)").matches : false;
      }

      // src/index.js
      var name = "dsh-mascot";
      var inject = ["slots"];
      var SIGNAL_EVENT = "dsh-mascot:signal";
      var MOOD_TICK_MS = 2e4;
      function apply(ctx) {
        ctx.effect(() => injectStyles(), "dsh-mascot: styles");
        ctx.slots.inject(
          "shell.overlay",
          () => ctx.slots.register({ name: "shell.overlay", id: "mascot", order: 900 }, MascotLayer)
        );
      }
      var BUBBLE_MS = 2400;
      function MascotLayer() {
        const anchorRef = (0, import_react.useRef)(
          /** @type {HTMLDivElement | null} */
          null
        );
        (0, import_react.useEffect)(() => {
          const host = anchorRef.current;
          if (!host) return void 0;
          return mountMascot(host);
        }, []);
        return (0, import_react.createElement)("div", { ref: anchorRef, className: "dsh-mascot-anchor" });
      }
      function mountMascot(host) {
        let config = loadConfig();
        let signal = { lastActivityAt: Date.now() };
        let mood = resolveMood(signal);
        let models = [];
        let live2d = null;
        let detachLookAt = null;
        let panel = null;
        let bubbleTimer = 0;
        let disposed = false;
        const root = document.createElement("div");
        root.className = "dsh-mascot";
        root.dataset.theme = detectTheme();
        root.dataset.act = "sit";
        const bubble = document.createElement("div");
        bubble.className = "dsh-mascot__bubble";
        bubble.hidden = true;
        bubble.setAttribute("role", "status");
        const stage = document.createElement("div");
        stage.className = "dsh-mascot__stage";
        const body = document.createElement("button");
        body.type = "button";
        body.className = "dsh-mascot__body";
        body.appendChild(createCharacter());
        const gear = document.createElement("button");
        gear.type = "button";
        gear.className = "dsh-mascot__gear";
        gear.textContent = "\u2699";
        gear.title = "\u677F\u5A18\u8BBE\u7F6E";
        stage.append(body, gear);
        root.append(bubble, stage);
        host.appendChild(root);
        body.addEventListener("click", greet);
        gear.addEventListener("click", togglePanel);
        window.addEventListener(SIGNAL_EVENT, onSignal);
        const stopWatchingTheme = watchTheme((theme) => {
          root.dataset.theme = theme;
        });
        const detachGaze = attachGazeToElement(
          /** @type {HTMLElement} */
          body.firstElementChild,
          () => body.getBoundingClientRect()
        );
        const moodTimer = window.setInterval(() => {
          if (!signal.running && !signal.awaitingApproval) setMood(resolveMood(signal));
        }, MOOD_TICK_MS);
        const player = createActPlayer({
          onAct(act) {
            root.dataset.act = act;
          }
        });
        player.setMood(mood);
        player.start();
        render();
        void loadManifest();
        void applyModel();
        function render() {
          root.style.setProperty("--dsh-mascot-scale", String(config.scale));
          root.dataset.mood = mood;
          body.title = `\u70B9\u4E00\u4E0B${config.displayName}\uFF08${MOOD_LABEL[mood]}\uFF09`;
          body.setAttribute("aria-label", `${config.displayName}\uFF0C\u5F53\u524D${MOOD_LABEL[mood]}\uFF0C\u70B9\u4E00\u4E0B\u6253\u62DB\u547C`);
        }
        function setMood(next) {
          if (next === mood) return;
          mood = next;
          player.setMood(next);
          render();
        }
        function onSignal(event) {
          const detail = (
            /** @type {CustomEvent} */
            event.detail
          );
          if (!detail || typeof detail !== "object") return;
          signal = { ...signal, ...detail };
          setMood(resolveMood(signal));
        }
        function greet() {
          showBubble(pickGreeting());
          signal.lastActivityAt = Date.now();
          setMood("happy");
          player.poke("jump");
          if (bubbleTimer) window.clearTimeout(bubbleTimer);
          bubbleTimer = window.setTimeout(() => {
            bubble.hidden = true;
            setMood(resolveMood(signal));
          }, BUBBLE_MS);
        }
        function showBubble(text) {
          bubble.textContent = text;
          bubble.hidden = !config.showBubble;
        }
        async function loadManifest() {
          models = await fetchModelManifest();
          if (disposed) return;
          const bundled = models[0];
          if (!bundled || config.modelUrl) return;
          config = saveConfig({ modelUrl: bundled.url });
          void applyModel();
        }
        async function applyModel() {
          detachLookAt?.();
          detachLookAt = null;
          live2d?.destroy();
          live2d = null;
          body.hidden = false;
          if (!config.modelUrl) return;
          try {
            const mounted = await mountLive2D(stage, config.modelUrl);
            if (disposed) {
              mounted.destroy();
              return;
            }
            live2d = mounted;
            body.hidden = true;
            detachLookAt = attachLookAt(mounted.model, () => stage.getBoundingClientRect());
          } catch (error) {
            console.warn("[dsh-mascot] \u6A21\u578B\u52A0\u8F7D\u5931\u8D25\uFF0C\u56DE\u843D\u5230\u5185\u7F6E\u7ACB\u7ED8\uFF1A", error);
            body.hidden = false;
          }
        }
        function togglePanel() {
          if (panel) {
            closePanel();
            return;
          }
          panel = createSettingsPanel({
            config,
            models,
            onPatch(patch) {
              const previousModelUrl = config.modelUrl;
              config = saveConfig(patch);
              render();
              if (patch.modelUrl !== void 0 && patch.modelUrl !== previousModelUrl) void applyModel();
            },
            onClose: closePanel
          });
          stage.appendChild(panel);
        }
        function closePanel() {
          panel?.remove();
          panel = null;
        }
        function dispose() {
          disposed = true;
          player.destroy();
          body.removeEventListener("click", greet);
          gear.removeEventListener("click", togglePanel);
          window.removeEventListener(SIGNAL_EVENT, onSignal);
          window.clearInterval(moodTimer);
          if (bubbleTimer) window.clearTimeout(bubbleTimer);
          stopWatchingTheme();
          detachGaze();
          detachLookAt?.();
          live2d?.destroy();
          panel = null;
          root.remove();
        }
        return dispose;
      }

    return module.exports;
  }
});
