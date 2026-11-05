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
          <!-- \u540E\u53D1\uFF1A\u8EAB\u4F53\u4E4B\u540E\u7684\u5927\u5757\u5934\u53D1\uFF0C\u9732\u51FA\u80A9\u540E\u4E00\u5C42 -->
          <path class="mascot-hair-back" d="M80 24 C 118 24, 142 54, 139 94 C 137 120, 130 136, 126 160 L 34 160 C 30 136, 23 120, 21 94 C 18 54, 42 24, 80 24 Z" fill="url(#${u}-hair)"/>

          <path class="mascot-neck" d="M70 112 C 70 124, 70 130, 70 136 L 90 136 C 90 130, 90 124, 90 112 Z" fill="#f8ccb4"/>

          <!-- \u8EAB\u4F53 -->
          <g class="mascot-body">
            <path d="M80 126 C 61 126, 45 135, 39 151 C 32 169, 30 184, 30 200 L 130 200 C 130 184, 128 169, 121 151 C 115 135, 99 126, 80 126 Z" fill="url(#${u}-dress)"/>
            <path d="M68 128 C 71 141, 76 147, 80 153 C 84 147, 89 141, 92 128 Z" fill="#eef4ff" opacity="0.95"/>
            <path d="M80 151 C 67 142, 59 151, 67 158 C 73 161, 78 157, 80 151 Z" fill="#ff8fab"/>
            <path d="M80 151 C 93 142, 101 151, 93 158 C 87 161, 82 157, 80 151 Z" fill="#ff8fab"/>
            <circle cx="80" cy="151" r="3.4" fill="#ff6f95"/>
          </g>

          <g class="mascot-head">
            <!-- \u8033 -->
            <ellipse cx="38" cy="93" rx="7" ry="9" fill="#f8ccb4"/>
            <ellipse cx="122" cy="93" rx="7" ry="9" fill="#f8ccb4"/>

            <!-- \u8138 -->
            <path d="M80 44 C 105 44, 122 62, 122 88 C 122 110, 104 130, 80 132 C 56 130, 38 110, 38 88 C 38 62, 55 44, 80 44 Z" fill="url(#${u}-skin)"/>

            <!-- \u9B13\u53D1 -->
            <path class="mascot-lock mascot-lock--l" d="M40 74 C 30 93, 28 120, 34 148 C 36 157, 47 157, 48 148 C 42 120, 43 93, 50 76 Z" fill="url(#${u}-hair)"/>
            <path class="mascot-lock mascot-lock--r" d="M40 74 C 30 93, 28 120, 34 148 C 36 157, 47 157, 48 148 C 42 120, 43 93, 50 76 Z" fill="url(#${u}-hair)" transform="translate(160 0) scale(-1 1)"/>

            <!-- \u5218\u6D77 -->
            <path class="mascot-bangs" d="M37 89 C 33 56, 53 29, 80 29 C 107 29, 127 56, 123 89 C 119 70, 111 57, 100 52 C 96 66, 86 72, 76 64 C 70 74, 58 74, 52 63 C 45 68, 40 78, 37 89 Z" fill="url(#${u}-hair)"/>
            <path d="M57 41 C 65 33, 79 30, 93 34" fill="none" stroke="#8a83b8" stroke-width="3" stroke-linecap="round" opacity="0.5"/>

            <!-- \u5446\u6BDB -->
            <path class="mascot-ahoge" d="M79 31 C 76 17, 86 6, 98 11 C 89 12, 83 20, 85 32 Z" fill="url(#${u}-hair)"/>

            <!-- \u53D1\u5939 -->
            <path class="mascot-clip" d="M104 50 L107 57 L114 60 L107 63 L104 70 L101 63 L94 60 L101 57 Z" fill="#ffd05c"/>

            <!-- \u7709 -->
            <g class="mascot-brows" stroke="#544d7a" stroke-width="2.3" stroke-linecap="round" fill="none" opacity="0.78">
              <path d="M53 68 C 57 64, 67 64, 71 66.5"/>
              <path d="M107 68 C 103 64, 93 64, 89 66.5"/>
            </g>

            <!-- \u773C -->
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

            <!-- \u816E\u7EA2 -->
            <ellipse cx="50" cy="104" rx="9" ry="4.8" fill="#ff9db1" opacity="0.4"/>
            <ellipse cx="110" cy="104" rx="9" ry="4.8" fill="#ff9db1" opacity="0.4"/>

            <!-- \u9F3B -->
            <path d="M79.4 99 C 81 100.4, 81 101.4, 79.4 102.4" fill="none" stroke="#e3a892" stroke-width="1.6" stroke-linecap="round"/>

            <!-- \u5634\uFF1A\u4E09\u79CD\u5F62\u6001\uFF0C\u7531 data-mood \u5207\u6362 -->
            <g class="mascot-mouths">
              <path class="mascot-mouth mascot-mouth--smile" d="M72.5 110.5 C 76.5 115.5, 83.5 115.5, 87.5 110.5" fill="none" stroke="#c76b7c" stroke-width="2.6" stroke-linecap="round"/>
              <path class="mascot-mouth mascot-mouth--flat" d="M75.5 112.5 L 84.5 112.5" fill="none" stroke="#c76b7c" stroke-width="2.4" stroke-linecap="round"/>
              <g class="mascot-mouth mascot-mouth--open">
                <ellipse cx="80" cy="112.5" rx="5.6" ry="6.2" fill="#b1556a"/>
                <ellipse cx="80" cy="115.4" rx="3.2" ry="2.1" fill="#ff8fa0"/>
              </g>
            </g>
          </g>

          <!-- \u7B49\u5F85\u786E\u8BA4\u65F6\u7684\u7425\u73C0\u5149\u73AF -->
          <circle class="mascot-ring" cx="80" cy="88" r="60" fill="none" stroke="#ffb84c" stroke-width="2.5"/>

          <!-- \u6253\u76F9\u7684 zZz -->
          <g class="mascot-zzz" fill="#9a92c8" font-size="12" font-weight="600">
            <text class="mascot-zzz__a" x="116" y="50">Z</text>
            <text class="mascot-zzz__b" x="126" y="36">z</text>
          </g>
        </g>
      </svg>`;
      }

      // src/config.js
      var STORAGE_KEY = "dsh-mascot:config";
      var DEFAULT_CONFIG = {
        displayName: "\u677F\u5A18",
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
        "\u5728\u7684\uFF0C\u7EE7\u7EED\u5427\u3002",
        "\u8FD9\u6BB5\u4EE3\u7801\u6211\u770B\u61C2\u4E86\u2026\u2026\u5927\u6982\u3002",
        "\u8981\u4E0D\u8981\u5148\u8DD1\u4E2A\u6D4B\u8BD5\uFF1F",
        "\u522B\u71AC\u592A\u665A\u3002",
        "\u6478\u6478\u3002"
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
        width: 160px;
        height: 200px;
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
        width: 160px;
        height: 200px;
        transition: transform 180ms ease-out;
      }

      .dsh-mascot__stage:hover .dsh-mascot__art { transform: translateY(-3px); }

      .dsh-mascot__svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      /* \u547C\u5438\uFF1A\u6574\u53EA\u4E0A\u4E0B\u5FAE\u5FAE\u8D77\u4F0F\uFF0C\u4F5C\u7528\u5728\u6700\u5916\u5C42\u7EC4\u4E0A\uFF0C\u5934\u548C\u8EAB\u4F53\u4E00\u8D77\u52A8\u624D\u4E0D\u6563\u67B6 */
      .mascot-breathe {
        transform-box: fill-box;
        transform-origin: 50% 100%;
        animation: mascot-breathe 4.8s ease-in-out infinite;
      }

      /* \u773C\u795E\uFF1A\u5934\u5E26\u4E00\u70B9\u70B9\uFF0C\u77B3\u5B54\u5E26\u591A\u4E00\u70B9\u3002--gaze-x/y \u7531 look-at.js \u5199\u5728\u5916\u5C42\u8282\u70B9\u4E0A */
      .mascot-head {
        transform-box: fill-box;
        transform-origin: 50% 88%;
        transform:
          translate(calc(var(--gaze-x, 0) * 2px), calc(var(--gaze-y, 0) * -1.5px))
          rotate(calc(var(--gaze-x, 0) * 3.5deg));
        transition: transform 240ms ease-out;
      }

      .mascot-pupil {
        transform: translate(calc(var(--gaze-x, 0) * 2.6px), calc(var(--gaze-y, 0) * -2px));
        transition: transform 90ms linear;
      }

      .mascot-eyes {
        transform-box: fill-box;
        transform-origin: 50% 50%;
        animation: mascot-blink 5.6s ease-in-out infinite;
      }

      .mascot-ahoge {
        transform-box: fill-box;
        transform-origin: 50% 100%;
        animation: mascot-ahoge 3.8s ease-in-out infinite;
      }

      /* \u5634\uFF1A\u4E09\u79CD\u5F62\u6001\u5E38\u9A7B\u5728 DOM \u91CC\uFF0C\u53EA\u5207\u900F\u660E\u5EA6\uFF0C\u907F\u514D\u5207\u59FF\u6001\u65F6\u95EA\u4E00\u4E0B */
      .mascot-mouth { opacity: 0; transition: opacity 120ms linear; }
      .mascot-mouth--smile { opacity: 1; }

      /* \u7B49\u5F85\u786E\u8BA4\uFF1A\u7425\u73C0\u8272\u5149\u73AF\u8109\u51B2 */
      .mascot-ring {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: 50% 50%;
      }

      /* \u6253\u76F9\uFF1A\u98D8\u51FA\u6765\u7684 zZz */
      .mascot-zzz { opacity: 0; }

      /* ---------------- \u59FF\u6001 ---------------- */
      .dsh-mascot[data-mood='working'] .mascot-breathe { animation-duration: 2.4s; }

      .dsh-mascot[data-mood='working'] .mascot-eyes { animation-duration: 3.4s; }

      .dsh-mascot[data-mood='waiting'] .mascot-ring {
        animation: mascot-ring 1.8s ease-out infinite;
      }

      /* \u5149\u73AF\u662F"\u626B\u8FC7\u53BB"\u7684\uFF0C\u5355\u9760\u5B83\u5BB9\u6613\u6F0F\u770B\uFF0C\u518D\u53E0\u4E00\u5C42\u5E38\u4EAE\u7684\u6696\u8272\u63CF\u8FB9 */
      .dsh-mascot[data-mood='waiting'] .dsh-mascot__art {
        filter: drop-shadow(0 0 9px rgba(255, 184, 76, 0.55));
      }

      .dsh-mascot[data-mood='waiting'] .mascot-breathe { animation-duration: 3s; }

      .dsh-mascot[data-mood='sleepy'] .mascot-breathe { animation-duration: 7s; }

      .dsh-mascot[data-mood='sleepy'] .mascot-eyes {
        animation: none;
        transform: scaleY(0.1);
      }

      .dsh-mascot[data-mood='sleepy'] .mascot-mouth--smile { opacity: 0; }
      .dsh-mascot[data-mood='sleepy'] .mascot-mouth--flat { opacity: 1; }

      .dsh-mascot[data-mood='sleepy'] .mascot-zzz { opacity: 1; }
      .dsh-mascot[data-mood='sleepy'] .mascot-zzz__a { animation: mascot-zzz 3.2s ease-in-out infinite; }
      .dsh-mascot[data-mood='sleepy'] .mascot-zzz__b { animation: mascot-zzz 3.2s ease-in-out 1.1s infinite; }

      .dsh-mascot[data-mood='happy'] .mascot-mouth--smile { opacity: 0; }
      .dsh-mascot[data-mood='happy'] .mascot-mouth--open { opacity: 1; }
      .dsh-mascot[data-mood='happy'] .dsh-mascot__art { animation: mascot-hop 520ms ease-out 2; }

      /* ---------------- \u6C14\u6CE1 ---------------- */
      /* \u8D34\u5728\u5934\u9876\u800C\u4E0D\u662F\u811A\u8FB9\uFF1A\u6C14\u6CE1\u662F"\u5979\u5728\u8BF4\u8BDD"\uFF0C\u4F4D\u7F6E\u5FC5\u987B\u9760\u8FD1\u8138 */
      .dsh-mascot__bubble {
        position: relative;
        align-self: flex-start;
        margin-top: 22px;
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
        right: 6px;
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
      @keyframes mascot-breathe {
        0%, 100% { transform: scaleY(1); }
        50% { transform: scaleY(1.022); }
      }

      @keyframes mascot-blink {
        0%, 90%, 100% { transform: scaleY(1); }
        93% { transform: scaleY(0.08); }
        96% { transform: scaleY(1); }
      }

      @keyframes mascot-ahoge {
        0%, 100% { transform: rotate(-4deg); }
        50% { transform: rotate(4deg); }
      }

      @keyframes mascot-ring {
        0% { opacity: 0.75; transform: scale(0.86); }
        75% { opacity: 0; transform: scale(1.08); }
        100% { opacity: 0; transform: scale(1.08); }
      }

      @keyframes mascot-zzz {
        0% { opacity: 0; transform: translateY(6px) scale(0.92); }
        25% { opacity: 0.85; }
        75% { opacity: 0.85; }
        100% { opacity: 0; transform: translateY(-10px) scale(1.06); }
      }

      @keyframes mascot-hop {
        0%, 100% { transform: translateY(0); }
        45% { transform: translateY(-10px); }
      }

      @keyframes mascot-pop {
        from { opacity: 0; transform: translateY(6px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .mascot-breathe,
        .mascot-eyes,
        .mascot-ahoge,
        .mascot-ring,
        .mascot-zzz__a,
        .mascot-zzz__b,
        .dsh-mascot__art,
        .dsh-mascot__bubble {
          animation: none !important;
        }
        .mascot-head,
        .mascot-pupil { transition: none !important; }
      }

      @media (max-width: 720px) {
        .dsh-mascot { right: 12px; bottom: 10px; }
        .dsh-mascot__body,
        .dsh-mascot__art { width: 120px; height: 150px; }
        .dsh-mascot__canvas { width: 150px; height: 190px; }
        .dsh-mascot__bubble { max-width: 150px; margin-bottom: 18px; }
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
