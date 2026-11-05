// @ts-check
/** @typedef {import('./types.js').MascotConfig} MascotConfig */

/**
 * 设置面板。
 *
 * 现在是浮层里的一张小卡片，够用但不算体面——最终形态应该挂进
 * DSH 设置页的 settings.section 槽（见 README 路线图）。
 *
 * @param {object} options
 * @param {MascotConfig} options.config
 * @param {Array<{id: string, label: string, url: string}>} options.models 内置模型候选
 * @param {(patch: Partial<MascotConfig>) => void} options.onPatch
 * @param {() => void} options.onClose
 * @returns {HTMLDivElement}
 */
export function createSettingsPanel({ config, models, onPatch, onClose }) {
  const panel = document.createElement('div')
  panel.className = 'dsh-mascot__panel'
  panel.setAttribute('role', 'dialog')
  panel.setAttribute('aria-label', '板娘设置')

  const title = document.createElement('div')
  title.className = 'dsh-mascot__panel-title'
  title.textContent = '板娘设置'

  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'dsh-mascot__panel-close'
  close.textContent = '×'
  close.title = '关闭'
  close.addEventListener('click', onClose)

  title.appendChild(close)

  // 称呼
  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.value = config.displayName
  nameInput.className = 'dsh-mascot__input'
  nameInput.addEventListener('change', () => {
    onPatch({ displayName: nameInput.value.trim() || '板娘' })
  })

  // 缩放
  const scaleInput = document.createElement('input')
  scaleInput.type = 'range'
  scaleInput.min = '0.6'
  scaleInput.max = '1.6'
  scaleInput.step = '0.05'
  scaleInput.value = String(config.scale)
  scaleInput.addEventListener('input', () => {
    onPatch({ scale: Number(scaleInput.value) })
  })

  // 气泡开关
  const bubbleInput = document.createElement('input')
  bubbleInput.type = 'checkbox'
  bubbleInput.checked = config.showBubble
  bubbleInput.addEventListener('change', () => {
    onPatch({ showBubble: bubbleInput.checked })
  })

  // 模型地址
  const modelInput = document.createElement('input')
  modelInput.type = 'text'
  modelInput.value = config.modelUrl
  modelInput.className = 'dsh-mascot__input'
  modelInput.placeholder = 'https://…/xxx.model3.json（留空用内置立绘）'
  modelInput.setAttribute('list', 'dsh-mascot-models')
  modelInput.addEventListener('change', () => {
    onPatch({ modelUrl: modelInput.value.trim() })
  })

  panel.append(
    title,
    row('称呼', nameInput),
    row('缩放', scaleInput),
    row('气泡', bubbleInput),
    row('模型', modelInput),
  )

  if (models.length > 0) {
    const list = document.createElement('datalist')
    list.id = 'dsh-mascot-models'
    for (const model of models) {
      const option = document.createElement('option')
      option.value = model.url
      option.textContent = model.label
      list.appendChild(option)
    }
    panel.appendChild(list)
  }

  const hint = document.createElement('p')
  hint.className = 'dsh-mascot__hint'
  hint.textContent = '模型地址需要可跨域访问；内置模型要先让宿主把 assets/ 挂出来。'
  panel.appendChild(hint)

  return panel
}

/**
 * @param {string} labelText
 * @param {HTMLElement} control
 * @returns {HTMLLabelElement}
 */
function row(labelText, control) {
  const wrapper = document.createElement('label')
  wrapper.className = 'dsh-mascot__row'

  const span = document.createElement('span')
  span.textContent = labelText

  wrapper.append(span, control)
  return wrapper
}
