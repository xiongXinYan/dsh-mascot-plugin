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

      // src/portrait.js
      var PORTRAIT_DATA_URI = "data:image/webp;base64,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";

      // src/character.js
      var instanceSeq = 0;
      function createCharacter() {
        const uid = `mc${++instanceSeq}`;
        const el = document.createElement("div");
        el.className = "dsh-mascot__art";
        el.innerHTML = `<div class="dsh-mascot__act">
        <img class="dsh-mascot__portrait" src="${PORTRAIT_DATA_URI}" alt="" draggable="false" decoding="async">
      </div>
      <svg class="dsh-mascot__fx" viewBox="0 0 200 169" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-uid="${uid}">
        <ellipse class="mascot-shadow" cx="100" cy="160" rx="62" ry="4"/>
        <circle class="mascot-halo" cx="141" cy="56" r="40"/>
        <g class="mascot-zzz" font-family="system-ui, sans-serif" font-weight="700" fill="#cfc6e6">
          <text class="mascot-zzz__a" x="170" y="46" font-size="14">z</text>
          <text class="mascot-zzz__b" x="184" y="28" font-size="17">Z</text>
        </g>
      </svg>`;
        return el;
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
        width: 200px;
        height: 169px;
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
      /* 620\xD7525 \u7684\u900F\u660E\u5E95\u4F4D\u7ED8\uFF0C\u5BB9\u5668\u6309\u539F\u6BD4\u4F8B\u7ED9\uFF0C\u62C9\u4F38\u4F1A\u628A\u72D7\u538B\u6241 */
      .dsh-mascot__art {
        position: relative;
        width: 200px;
        height: 169px;
        transform:
          translate(
            calc(var(--gaze-x, 0) * 2.5px),
            calc(var(--gaze-y, 0) * -1.6px + var(--hover-y, 0px))
          );
        transition: transform 200ms ease-out;
      }

      .dsh-mascot__stage:hover .dsh-mascot__art { --hover-y: -3px; }

      /* \u59FF\u6001\u5C42\uFF1Adata-act \u6362 --p-act\uFF0C\u9760 transition \u8FC7\u6E21 */
      .dsh-mascot__act {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        transform-origin: 50% 88%;
        transform: var(--p-act, none);
        transition: transform 560ms var(--ease-pose), filter 420ms ease-out;
      }

      /* \u6DF1\u8272\u754C\u9762\u4E0A\u9ED1\u72D7\u4F1A\u7CCA\u8FDB\u80CC\u666F\uFF1A\u6574\u4F53\u63D0\u4E00\u70B9\u4EAE\u5EA6\uFF0C\u6BD4\u6539\u6BDB\u8272\u5B89\u5168 */
      .dsh-mascot[data-theme='dark'] .dsh-mascot__act { filter: brightness(1.13); }

      .dsh-mascot__portrait {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        transform-origin: 50% 94%;
        animation: mascot-breathe 4.6s ease-in-out infinite;
        transition: filter 420ms ease-out;
        -webkit-user-drag: none;
      }

      /* \u5F71\u5B50\u3001\u7B49\u5F85\u5149\u6655\u3001zZz \u90FD\u662F"\u5916\u56F4\u72B6\u6001"\uFF0C\u4E0D\u78B0\u72D7\u672C\u8EAB */
      .dsh-mascot__fx {
        position: absolute;
        z-index: 0;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        pointer-events: none;
      }

      .mascot-shadow {
        fill: #06050a;
        opacity: 0.22;
        filter: blur(3px);
        transform-box: fill-box;
        transform-origin: 50% 50%;
      }

      .dsh-mascot[data-theme='dark'] .mascot-shadow { opacity: 0.34; }

      .mascot-halo {
        fill: #ffb84c;
        opacity: 0;
        filter: blur(9px);
        transform-box: fill-box;
        transform-origin: 50% 50%;
      }

      .mascot-zzz { opacity: 0; transition: opacity 260ms linear; }
      .mascot-zzz text {
        opacity: 0;
        transform-box: fill-box;
        transform-origin: 50% 50%;
      }

      /* ---------------- \u59FF\u6001 ---------------- */
      /* \u5199\u5B9E\u7ACB\u7ED8\u4E0D\u80FD\u63B0\u5934\u63B0\u817F\uFF0C\u52A8\u4F5C\u6539\u6210"\u6574\u53EA\u72D7\u600E\u4E48\u52A8"\uFF0C\u9760\u5E45\u5EA6\u533A\u5206\u800C\u4E0D\u662F\u5F62\u53D8 */
      .dsh-mascot[data-act='stretch'] { --p-act: translateY(-7px) scale(1.035, 1.055); }
      .dsh-mascot[data-act='bow']     { --p-act: translateY(6px) scale(1.02, 0.91) rotate(1.5deg); }
      .dsh-mascot[data-act='wink']    { --p-act: translateY(-2px) rotate(-4deg) scale(1.01); }
      .dsh-mascot[data-act='alert']   { --p-act: translateY(-4px) scale(1.02); }
      .dsh-mascot[data-act='nap']     { --p-act: translateY(3px) scale(0.985); }

      /* \u8DF3\u8981\u4EA4\u7ED9\u5173\u952E\u5E27\uFF0C\u9759\u6001\u4F4D\u79FB\u505A\u4E0D\u51FA\u8D77\u843D */
      .dsh-mascot[data-act='jump'] .dsh-mascot__portrait {
        animation: mascot-hop 1000ms var(--ease-pose) both;
      }
      .dsh-mascot[data-act='jump'] .mascot-shadow {
        animation: mascot-shadow-hop 1000ms var(--ease-pose) both;
      }

      .dsh-mascot[data-act='nap'] .dsh-mascot__portrait {
        filter: brightness(0.82) saturate(0.9);
        animation-duration: 7.4s;
      }
      .dsh-mascot[data-act='nap'] .mascot-zzz { opacity: 1; }
      .dsh-mascot[data-act='nap'] .mascot-zzz__a { animation: mascot-zzz 3.2s ease-in-out infinite; }
      .dsh-mascot[data-act='nap'] .mascot-zzz__b { animation: mascot-zzz 3.2s ease-in-out 1.1s infinite; }

      /* ---------------- \u60C5\u7EEA ---------------- */
      .dsh-mascot[data-mood='working'] .dsh-mascot__portrait { animation-duration: 2.9s; }
      .dsh-mascot[data-mood='happy'] .dsh-mascot__portrait { animation-duration: 2.4s; }
      .dsh-mascot[data-mood='sleepy'] .dsh-mascot__portrait { animation-duration: 7s; }

      .dsh-mascot[data-mood='waiting'] .mascot-halo {
        opacity: 0.42;
        animation: mascot-halo 2.6s ease-out infinite;
      }

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
      @keyframes mascot-breathe {
        0%, 100% { transform: scale(1, 1); }
        50% { transform: scale(1.008, 1.018); }
      }

      @keyframes mascot-hop {
        0%   { transform: translateY(0) scale(1, 1); }
        16%  { transform: translateY(5px) scale(1.04, 0.94); }
        40%  { transform: translateY(-24px) scale(0.97, 1.05); }
        62%  { transform: translateY(-5px) scale(1, 1.01); }
        80%  { transform: translateY(3px) scale(1.03, 0.96); }
        100% { transform: translateY(0) scale(1, 1); }
      }

      @keyframes mascot-shadow-hop {
        0%, 100% { transform: scale(1); opacity: 0.22; }
        40% { transform: scale(0.7); opacity: 0.1; }
        80% { transform: scale(1.05); opacity: 0.26; }
      }

      @keyframes mascot-halo {
        0%   { opacity: 0.42; transform: scale(0.9); }
        70%  { opacity: 0.12; transform: scale(1.12); }
        100% { opacity: 0.42; transform: scale(0.9); }
      }

      @keyframes mascot-zzz {
        0%   { opacity: 0; transform: translateY(6px) scale(0.9); }
        25%  { opacity: 0.9; }
        75%  { opacity: 0.9; }
        100% { opacity: 0; transform: translateY(-10px) scale(1.06); }
      }

      @keyframes mascot-pop {
        from { opacity: 0; transform: translateY(6px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .dsh-mascot__portrait,
        .mascot-halo,
        .mascot-shadow,
        .mascot-zzz__a,
        .mascot-zzz__b,
        .dsh-mascot__bubble {
          animation: none !important;
        }
        .dsh-mascot__art,
        .dsh-mascot__act,
        .dsh-mascot__portrait { transition: none !important; }
      }

      @media (max-width: 720px) {
        .dsh-mascot { right: 12px; bottom: 10px; }
        .dsh-mascot__body,
        .dsh-mascot__art { width: 150px; height: 127px; }
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
