window.__ModuleLoader__.load({
  id: 'ds-fenggu-pill',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const NS = 'dsFenggu'
    const ENDPOINT = 'https://dsfgz.xinwkx.top/v1/fenggu'
    const POLL_MS = 60000
    const REQUEST_TIMEOUT_MS = 12000
    const REFRESH_AFTER_MS = 30000
    const PANEL_ID = 'ds-fenggu-panel'
    const TITLE_ID = 'ds-fenggu-title'

    const zh = {
      'pill.valley': '梁文谷 · 半价',
      'pill.peak': '梁文峰 · 全价',
      'pill.loading': '峰谷 · 同步中',
      'pill.offline': '峰谷 · 离线',
      'pill.stale': '更新失败',
      'name.peak': '梁文峰',
      'name.valley': '梁文谷',
      'count.toPeak': '距峰',
      'count.toValley': '距谷',
      'panel.valleyTitle': '梁文谷 · 空闲半价',
      'panel.peakTitle': '梁文峰 · 高峰全价',
      'panel.next': '下次切换',
      'panel.segment': '本段区间',
      'panel.half': '半价',
      'panel.full': '全价',
      'panel.rule': '高峰为北京时间工作日 09:00–12:00、14:00–18:00；其余时段、周末与法定节假日按半价计费。',
      'panel.holidayValley': '法定节假日：全天按空闲时段计费',
      'panel.makeup': '调休上班',
      'panel.source': '数据源',
      'panel.updated': '更新于 {time}',
      'panel.refresh': '刷新',
      'panel.error': '峰谷数据暂不可用',
      'panel.errorHint': '请检查网络后重试。数据来自 dsfgz.xinwkx.top。',
      'panel.loading': '正在同步峰谷数据…',
      'panel.retry': '重试',
      'panel.syncing': '同步中…',
      'panel.stale': '更新失败，显示上次数据。',
      'panel.beijing': '北京时间',
      'aria.open': '查看 DeepSeek 峰谷价详情',
      'fmt.day': '{d} 天 {h}:{mi}:{s}',
    }

    const en = {
      'pill.valley': 'Off-peak · half price',
      'pill.peak': 'Peak · full price',
      'pill.loading': 'Peak/off-peak · syncing',
      'pill.offline': 'Peak/off-peak · offline',
      'pill.stale': 'update failed',
      'name.peak': 'Peak',
      'name.valley': 'Off-peak',
      'count.toPeak': 'to peak',
      'count.toValley': 'to off-peak',
      'panel.valleyTitle': 'Off-peak · half price',
      'panel.peakTitle': 'Peak · full price',
      'panel.next': 'Next switch',
      'panel.segment': 'Current segment',
      'panel.half': '50% off',
      'panel.full': 'Full price',
      'panel.rule': 'Peak hours are 09:00–12:00 and 14:00–18:00 on weekdays (Beijing time). All other hours, weekends, and statutory holidays are billed at half price.',
      'panel.holidayValley': 'Statutory holiday: off-peak all day',
      'panel.makeup': 'Make-up workday',
      'panel.source': 'Source',
      'panel.updated': 'Updated {time}',
      'panel.refresh': 'Refresh',
      'panel.error': 'Peak/off-peak data unavailable',
      'panel.errorHint': 'Check the network and retry. Data comes from dsfgz.xinwkx.top.',
      'panel.loading': 'Syncing peak/off-peak data…',
      'panel.retry': 'Retry',
      'panel.syncing': 'Syncing…',
      'panel.stale': 'Update failed; showing the last data.',
      'panel.beijing': 'Beijing time',
      'aria.open': 'Show DeepSeek peak and off-peak price details',
      'fmt.day': '{d}d {h}:{mi}:{s}',
    }

    const COLORS = {
      valley: 'var(--dsw-alias-state-success-primary, #1f9d63)',
      peak: 'var(--dsw-alias-state-warn-primary, #c2740b)',
      error: 'var(--dsw-alias-state-error-primary, #d03a3a)',
      unknown: 'var(--dsw-alias-state-idle-primary, #8b8b8b)',
    }

    const STYLE = [
      '.dsfg-root{position:absolute;z-index:2;display:flex;align-items:center;pointer-events:auto;-webkit-app-region:no-drag;font-family:inherit;line-height:1}',
      '.dsfg-pill{display:inline-flex;align-items:center;gap:7px;height:26px;box-sizing:border-box;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l1, rgba(0,0,0,.12));border-radius:999px;background:color-mix(in srgb, var(--dsw-alias-bg-layer-1, #fff) 78%, transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:var(--dsw-alias-label-secondary, #666);font:inherit;font-size:12px;letter-spacing:.01em;white-space:nowrap;cursor:pointer;transition:background var(--ds-transition-duration, .16s) var(--ds-ease-in-out, ease),color var(--ds-transition-duration, .16s) var(--ds-ease-in-out, ease),border-color var(--ds-transition-duration, .16s) var(--ds-ease-in-out, ease)}',
      '.dsfg-pill:hover{background:color-mix(in srgb, var(--dsw-alias-bg-layer-2, #f4f4f5) 92%, transparent);color:var(--dsw-alias-label-primary, #111)}',
      '.dsfg-pill[aria-expanded="true"]{background:color-mix(in srgb, var(--dsw-alias-bg-layer-2, #f4f4f5) 96%, transparent);color:var(--dsw-alias-label-primary, #111);border-color:var(--dsw-alias-border-l2, rgba(0,0,0,.22))}',
      '.dsfg-pill:focus-visible{outline:2px solid var(--dsw-alias-brand-primary, #4d6bfe);outline-offset:2px}',
      '.dsfg-dot{width:6px;height:6px;flex:none;border-radius:50%;background:var(--dsfg-color, #8b8b8b);box-shadow:0 0 0 2.5px color-mix(in srgb, var(--dsfg-color, #8b8b8b) 20%, transparent)}',
      '.dsfg-label{min-width:0;overflow:hidden;text-overflow:ellipsis;font-weight:500}',
      '.dsfg-sep{width:1px;height:11px;flex:none;background:var(--dsw-alias-border-l1, rgba(0,0,0,.12))}',
      '.dsfg-count{min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--dsw-alias-label-primary, #111);font-variant-numeric:tabular-nums}',
      '.dsfg-count[data-stale="true"]{color:var(--dsw-alias-label-secondary, #8a8a8a)}',
      '.dsfg-panel{position:absolute;top:calc(100% + 8px);box-sizing:border-box;width:308px;max-width:calc(100vw - 24px);padding:14px;border:0.5px solid var(--dsw-alias-border-l1, rgba(0,0,0,.12));border-radius:var(--dsw-radius-lg, 14px);background:color-mix(in srgb, var(--dsw-alias-bg-overlay, #fff) 97%, transparent);-webkit-backdrop-filter:var(--dsw-menu-backdrop-filter, blur(20px) saturate(130%));backdrop-filter:var(--dsw-menu-backdrop-filter, blur(20px) saturate(130%));box-shadow:var(--dsw-shadow-lv3, 0 14px 36px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.06));color:var(--dsw-alias-label-primary, #111);font-size:12px;line-height:1.45;cursor:default}',
      '.dsfg-panel:focus{outline:none}',
      '.dsfg-panel:focus-visible{outline:2px solid var(--dsw-alias-brand-primary, #4d6bfe);outline-offset:2px}',
      '.dsfg-panel>*+*{margin-top:10px}',
      '.dsfg-head{display:flex;align-items:center;gap:8px}',
      '.dsfg-head .dsfg-dot{width:8px;height:8px}',
      '.dsfg-title{min-width:0;font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis}',
      '.dsfg-tag{margin-left:auto;flex:none;padding:1px 7px;border-radius:999px;font-size:11px;font-weight:500;color:var(--dsw-alias-label-primary, #111);background:color-mix(in srgb, var(--dsfg-color, #888) 13%, transparent)}',
      '.dsfg-icon{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;flex:none;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary, #666);cursor:pointer}',
      '.dsfg-icon:hover{background:var(--dsw-alias-bg-layer-2, #f4f4f5);color:var(--dsw-alias-label-primary, #111)}',
      '.dsfg-icon:focus-visible{outline:2px solid var(--dsw-alias-brand-primary, #4d6bfe);outline-offset:1px}',
      '.dsfg-icon:disabled{opacity:.5;cursor:default}',
      '.dsfg-icon svg{display:block;width:14px;height:14px}',
      '.dsfg-section{display:flex;flex-direction:column;gap:4px}',
      '.dsfg-kicker{display:flex;align-items:baseline;justify-content:space-between;gap:8px;color:var(--dsw-alias-label-secondary, #666);font-size:11px}',
      '.dsfg-big{font-size:22px;font-weight:600;line-height:1.15;letter-spacing:.02em;font-variant-numeric:tabular-nums}',
      '.dsfg-sub{color:var(--dsw-alias-label-secondary, #666);font-size:11px;font-variant-numeric:tabular-nums}',
      '.dsfg-bar{position:relative;height:4px;overflow:hidden;border-radius:2px;background:var(--dsw-alias-bg-layer-2, #eee)}',
      '.dsfg-fill{position:absolute;inset:0 auto 0 0;border-radius:2px;background:var(--dsfg-color, #888);transition:width .4s var(--ds-ease-in-out, ease)}',
      '.dsfg-ends{display:flex;justify-content:space-between;gap:8px;color:var(--dsw-alias-label-secondary, #666);font-size:11px;font-variant-numeric:tabular-nums}',
      '.dsfg-rule{margin:0;color:var(--dsw-alias-label-secondary, #666);font-size:11px;line-height:1.6}',
      '.dsfg-hr{height:0.5px;background:var(--dsw-alias-border-l1, rgba(0,0,0,.1))}',
      '.dsfg-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--dsw-alias-label-secondary, #8a8a8a);font-size:10.5px}',
      '.dsfg-error{display:flex;flex-direction:column;gap:8px}',
      '.dsfg-retry{align-self:flex-start;height:26px;padding:0 12px;border:0.5px solid var(--dsw-alias-border-l2, rgba(0,0,0,.2));border-radius:7px;background:var(--dsw-alias-bg-layer-2, #f4f4f5);color:var(--dsw-alias-label-primary, #111);font:inherit;font-size:12px;cursor:pointer}',
      '.dsfg-retry:hover{background:var(--dsw-alias-bg-layer-1, #fff)}',
      '.dsfg-retry:disabled{opacity:.55;cursor:default}',
      '@media (prefers-reduced-motion: reduce) { .dsfg-pill,.dsfg-fill{transition:none} }',
    ].join('')

    function documentLanguage() {
      if (typeof document === 'undefined') return 'en'
      return String(document.documentElement.lang || 'en').toLowerCase()
    }

    function isChinese() {
      return documentLanguage().indexOf('zh') === 0
    }

    function translate(props) {
      return function t(key, params) {
        const interpolate = (text) => {
          if (!params || typeof text !== 'string') return text
          return text.replace(/\{(\w+)\}/g, (match, name) => (
            params[name] === undefined ? match : String(params[name])
          ))
        }
        if (props && typeof props.t === 'function') {
          try {
            const rendered = params === undefined ? props.t(key) : props.t(key, params)
            if (typeof rendered === 'string' && rendered !== key) return interpolate(rendered)
          } catch (error) { /* fall through to the packaged dictionary */ }
        }
        const dictionary = isChinese() ? zh : en
        const text = dictionary[key] !== undefined ? dictionary[key] : (en[key] !== undefined ? en[key] : key)
        return interpolate(text)
      }
    }

    function pad(value) {
      return value < 10 ? '0' + value : '' + value
    }

    function beijingParts(value) {
      const date = new Date(value)
      if (!Number.isFinite(date.getTime())) return null
      const shifted = new Date(date.getTime() + 8 * 3600 * 1000)
      return {
        month: shifted.getUTCMonth() + 1,
        day: shifted.getUTCDate(),
        hours: shifted.getUTCHours(),
        minutes: shifted.getUTCMinutes(),
        seconds: shifted.getUTCSeconds(),
      }
    }

    function formatStamp(value) {
      const parts = beijingParts(value)
      if (parts === null) return '—'
      return pad(parts.month) + '-' + pad(parts.day) + ' ' + pad(parts.hours) + ':' + pad(parts.minutes)
    }

    function formatClock(value) {
      const parts = beijingParts(value)
      if (parts === null) return '—'
      return pad(parts.hours) + ':' + pad(parts.minutes) + ':' + pad(parts.seconds)
    }

    function formatCountdown(seconds, t) {
      const total = Math.max(0, Math.floor(seconds))
      const days = Math.floor(total / 86400)
      const hours = Math.floor((total % 86400) / 3600)
      const minutes = Math.floor((total % 3600) / 60)
      const rest = total % 60
      if (days > 0) return t('fmt.day', { d: days, h: pad(hours), mi: pad(minutes), s: pad(rest) })
      return pad(hours) + ':' + pad(minutes) + ':' + pad(rest)
    }

    function progressOf(data) {
      const current = data && data.current
      if (!current) return 0
      if (typeof current.progress === 'number' && Number.isFinite(current.progress)) {
        return Math.min(1, Math.max(0, current.progress))
      }
      const start = Date.parse(current.start)
      const end = Date.parse(current.end)
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0
      return Math.min(1, Math.max(0, (Date.now() - start) / (end - start)))
    }

    function isObject(value) {
      return value !== null && typeof value === 'object'
    }

    function useSnapshot() {
      const [state, setState] = React.useState({
        data: null, failed: false, loading: true, fetchedAt: 0, clockOffset: 0,
      })
      const requestRef = React.useRef(null)
      const reload = React.useCallback(function load() {
        if (requestRef.current !== null) return
        let controller = null
        try {
          controller = typeof AbortController === 'function' ? new AbortController() : null
        } catch (error) {
          controller = null
        }
        let timedOut = false
        let timer = null
        if (controller !== null) {
          timer = window.setTimeout(() => {
            timedOut = true
            controller.abort()
          }, REQUEST_TIMEOUT_MS)
        }
        requestRef.current = controller === null ? true : controller
        setState((previous) => (previous.loading ? previous : { ...previous, loading: true }))
        const options = { cache: 'no-store', headers: { accept: 'application/json' } }
        if (controller !== null) options.signal = controller.signal
        const settle = () => {
          if (timer !== null) window.clearTimeout(timer)
          requestRef.current = null
        }
        fetch(ENDPOINT, options)
          .then((response) => {
            if (!response.ok) throw new Error('HTTP ' + response.status)
            return response.json()
          })
          .then((data) => {
            if (!isObject(data) || data.ok !== true || typeof data.is_valley !== 'boolean') {
              throw new Error('unexpected payload')
            }
            if (!isObject(data.next) || !isObject(data.current)) throw new Error('incomplete payload')
            const serverNow = isObject(data.now) ? Date.parse(data.now.iso) : NaN
            setState({
              data,
              failed: false,
              loading: false,
              fetchedAt: Date.now(),
              clockOffset: Number.isFinite(serverNow) ? serverNow - Date.now() : 0,
            })
          })
          .catch(() => {
            if (controller !== null && controller.signal.aborted && !timedOut) return
            setState((previous) => ({ ...previous, failed: true, loading: false }))
          })
          .then(settle, settle)
      }, [])

      React.useEffect(() => {
        reload()
        const timer = window.setInterval(reload, POLL_MS)
        const onVisible = () => {
          if (document.visibilityState === 'visible') reload()
        }
        document.addEventListener('visibilitychange', onVisible)
        return () => {
          window.clearInterval(timer)
          document.removeEventListener('visibilitychange', onVisible)
          const request = requestRef.current
          if (request && typeof request.abort === 'function') request.abort()
          requestRef.current = null
        }
      }, [reload])

      return [state, reload]
    }

    function useTick() {
      const [now, setNow] = React.useState(() => Date.now())
      React.useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(timer)
      }, [])
      return now
    }

    function useCaptionAnchor() {
      const [anchor, setAnchor] = React.useState(null)
      React.useLayoutEffect(() => {
        let host = null
        let observer = null
        let frame = 0
        let attempts = 0

        function commit(next) {
          setAnchor((previous) => {
            if (previous !== null && previous.mode === next.mode
              && previous.left === next.left && previous.height === next.height) return previous
            return next
          })
        }

        function measure() {
          const element = typeof document === 'undefined' ? null : document.querySelector('[data-windows-menu]')
          if (element !== host) {
            host = element
            if (observer !== null) {
              observer.disconnect()
              observer = null
            }
            if (host !== null && typeof ResizeObserver === 'function') {
              observer = new ResizeObserver(measure)
              observer.observe(host)
            }
          }
          if (element === null) {
            commit({ mode: 'fallback', left: 0, height: 0 })
            return
          }
          const rect = element.getBoundingClientRect()
          if (!rect || rect.width <= 0) {
            commit({ mode: 'fallback', left: 0, height: 0 })
            return
          }
          commit({
            mode: 'titlebar',
            left: Math.round(rect.right + 10),
            height: Math.max(28, Math.min(48, Math.round(rect.height) || 40)),
          })
        }

        function poll() {
          measure()
          if (host === null && attempts < 40) {
            attempts += 1
            frame = window.requestAnimationFrame(poll)
          }
        }

        poll()
        window.addEventListener('resize', measure)
        const mutations = new MutationObserver(measure)
        mutations.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['data-fullscreen', 'lang'],
        })
        mutations.observe(document.body, {
          attributes: true,
          subtree: true,
          attributeFilter: ['data-sidebar-collapsed', 'data-sidebar-drawer'],
        })
        return () => {
          window.cancelAnimationFrame(frame)
          window.removeEventListener('resize', measure)
          mutations.disconnect()
          if (observer !== null) observer.disconnect()
        }
      }, [])
      return anchor
    }

    function RefreshIcon() {
      return h('svg', { viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' },
        h('path', {
          d: 'M13.1 6.5A5.5 5.5 0 1 0 13.3 10',
          stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round',
        }),
        h('path', {
          d: 'M13.4 3.1v3.6H9.8',
          stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round',
        }),
      )
    }

    function FengguStatus(props) {
      const t = translate(props)
      const [snapshot, reload] = useSnapshot()
      const now = useTick()
      const anchor = useCaptionAnchor()
      const [open, setOpen] = React.useState(false)
      const rootRef = React.useRef(null)
      const pillRef = React.useRef(null)
      const panelRef = React.useRef(null)
      const boundaryRef = React.useRef('')

      const data = snapshot.data
      const nextAt = data && isObject(data.next) ? Date.parse(data.next.at) : NaN
      const serverNow = now + snapshot.clockOffset
      const remaining = Number.isFinite(nextAt) ? Math.max(0, Math.floor((nextAt - serverNow) / 1000)) : null
      const stale = snapshot.failed && data !== null
      const nextIsPeak = data && isObject(data.next) && typeof data.next.tier === 'string'
        ? data.next.tier === 'peak'
        : false

      React.useEffect(() => {
        if (!open) return undefined
        function onPointerDown(event) {
          if (rootRef.current !== null && !rootRef.current.contains(event.target)) setOpen(false)
        }
        function onKeyDown(event) {
          if (event.key !== 'Escape') return
          setOpen(false)
          if (pillRef.current !== null) pillRef.current.focus()
        }
        document.addEventListener('pointerdown', onPointerDown, true)
        document.addEventListener('keydown', onKeyDown)
        return () => {
          document.removeEventListener('pointerdown', onPointerDown, true)
          document.removeEventListener('keydown', onKeyDown)
        }
      }, [open])

      React.useEffect(() => {
        if (!open || panelRef.current === null) return
        panelRef.current.focus({ preventScroll: true })
      }, [open])

      React.useEffect(() => {
        if (remaining !== 0 || data === null || !isObject(data.next) || snapshot.loading) return
        if (boundaryRef.current === data.next.at) return
        boundaryRef.current = data.next.at
        reload()
      }, [remaining, data, snapshot.loading, reload])

      const status = data === null
        ? (snapshot.failed ? 'error' : 'unknown')
        : (data.is_valley ? 'valley' : 'peak')
      const color = COLORS[status]
      const label = data === null
        ? (snapshot.failed ? t('pill.offline') : t('pill.loading'))
        : t(data.is_valley ? 'pill.valley' : 'pill.peak')
      const countdownLabel = data !== null && isObject(data.next)
        ? (nextIsPeak ? t('count.toPeak') : t('count.toValley'))
        : ''

      const titlebar = anchor !== null && anchor.mode === 'titlebar'
      const windowWidth = typeof window === 'undefined' ? 1200 : window.innerWidth
      const pillMaxWidth = titlebar
        ? Math.max(150, windowWidth - anchor.left - 168)
        : Math.min(340, windowWidth - 24)
      const rootStyle = titlebar
        ? {
          position: 'absolute',
          left: anchor.left + 'px',
          top: '0px',
          height: anchor.height + 'px',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'auto',
          WebkitAppRegion: 'no-drag',
        }
        : {
          position: 'absolute',
          left: '50%',
          top: '8px',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'auto',
          WebkitAppRegion: 'no-drag',
        }
      const panelStyle = titlebar
        ? { left: '0px', transform: 'none' }
        : { left: '50%', transform: 'translateX(-50%)' }

      const toggle = () => {
        const next = !open
        setOpen(next)
        if (next && !snapshot.loading && Date.now() - snapshot.fetchedAt > REFRESH_AFTER_MS) reload()
      }

      let panel = null
      if (open) {
        const panelTitle = data === null
          ? (snapshot.failed ? t('panel.error') : t('pill.loading'))
          : t(data.is_valley ? 'panel.valleyTitle' : 'panel.peakTitle')
        const nextName = data !== null && isObject(data.next)
          ? (isChinese() && data.next.name ? data.next.name : t(nextIsPeak ? 'name.peak' : 'name.valley'))
          : ''
        const header = h('div', { className: 'dsfg-head', key: 'head' },
          h('span', { className: 'dsfg-dot', 'aria-hidden': 'true' }),
          h('span', { className: 'dsfg-title', id: TITLE_ID }, panelTitle),
          data !== null
            ? h('span', { className: 'dsfg-tag' }, t(data.is_valley ? 'panel.half' : 'panel.full'))
            : null,
          h('button', {
            type: 'button',
            className: 'dsfg-icon',
            key: 'refresh',
            'aria-label': t('panel.refresh'),
            title: t('panel.refresh'),
            disabled: snapshot.loading,
            onClick: (event) => {
              event.preventDefault()
              event.stopPropagation()
              reload()
            },
          }, h(RefreshIcon)),
        )

        let body = null
        if (data === null) {
          body = snapshot.failed
            ? h('div', { className: 'dsfg-error', key: 'error' },
              h('p', { className: 'dsfg-rule' }, t('panel.errorHint')),
              h('button', {
                type: 'button',
                className: 'dsfg-retry',
                disabled: snapshot.loading,
                onClick: reload,
              }, snapshot.loading ? t('panel.syncing') : t('panel.retry')),
            )
            : h('p', { className: 'dsfg-rule', key: 'loading' }, t('panel.loading'))
        } else {
          const progress = progressOf(data)
          const notes = []
          if (isObject(data.now) && data.now.holiday) {
            notes.push(t('panel.holidayValley')
              + (isChinese() ? '（' + data.now.holiday + '）' : ''))
          }
          if (isObject(data.now) && data.now.makeup_workday) {
            notes.push(t('panel.makeup')
              + (isChinese() ? '（' + data.now.makeup_workday + '）' : ''))
          }
          body = [
            h('div', { className: 'dsfg-section', key: 'next' },
              h('div', { className: 'dsfg-kicker' },
                h('span', null, t('panel.next')),
                h('span', null, nextName)),
              h('div', { className: 'dsfg-big' },
                stale ? '—' : (remaining !== null ? formatCountdown(remaining, t) : '—')),
              h('div', { className: 'dsfg-sub' },
                isObject(data.next) ? formatStamp(data.next.at) + ' · ' + t('panel.beijing') : ''),
            ),
            h('div', { className: 'dsfg-section', key: 'segment' },
              h('div', { className: 'dsfg-kicker' },
                h('span', null, t('panel.segment')),
                h('span', null, Math.round(progress * 100) + '%')),
              h('div', { className: 'dsfg-bar' },
                h('div', { className: 'dsfg-fill', style: { width: Math.round(progress * 100) + '%' } })),
              h('div', { className: 'dsfg-ends' },
                h('span', null, isObject(data.current) ? formatStamp(data.current.start) : '—'),
                h('span', null, isObject(data.current) ? formatStamp(data.current.end) : '—')),
            ),
            notes.length > 0
              ? h('p', { className: 'dsfg-rule', key: 'notes' }, notes.join(' · '))
              : null,
            h('p', { className: 'dsfg-rule', key: 'rule' }, t('panel.rule')),
            h('div', { className: 'dsfg-hr', key: 'hr' }),
            h('div', { className: 'dsfg-foot', key: 'foot' },
              h('span', null, t('panel.source') + ' dsfgz.xinwkx.top'),
              h('span', null, t('panel.updated', { time: formatClock(snapshot.fetchedAt + snapshot.clockOffset) }))),
            stale
              ? h('p', { className: 'dsfg-rule', key: 'stale' }, t('panel.stale'))
              : null,
          ]
        }

        panel = h('div', {
          id: PANEL_ID,
          ref: panelRef,
          tabIndex: -1,
          className: 'dsfg-panel',
          role: 'dialog',
          'aria-modal': 'false',
          'aria-labelledby': TITLE_ID,
          style: { ...panelStyle, '--dsfg-color': color },
        }, header, body)
      }

      return h(React.Fragment, null,
        h('style', { key: 'style' }, STYLE),
        h('div', {
          className: 'dsfg-root',
          ref: rootRef,
          style: { ...rootStyle, '--dsfg-color': color },
        },
        h('button', {
          ref: pillRef,
          type: 'button',
          className: 'dsfg-pill',
          style: { maxWidth: pillMaxWidth + 'px' },
          'aria-haspopup': 'dialog',
          'aria-expanded': open ? 'true' : 'false',
          'aria-controls': open ? PANEL_ID : undefined,
          title: t('aria.open'),
          onClick: toggle,
        },
        h('span', { className: 'dsfg-dot', 'aria-hidden': 'true' }),
        h('span', { className: 'dsfg-label' }, label),
        stale
          ? h(React.Fragment, null,
            h('span', { className: 'dsfg-sep', 'aria-hidden': 'true' }),
            h('span', { className: 'dsfg-count', 'data-stale': 'true' }, t('pill.stale')))
          : (remaining !== null && data !== null
            ? h(React.Fragment, null,
              h('span', { className: 'dsfg-sep', 'aria-hidden': 'true' }),
              h('span', { className: 'dsfg-count' }, countdownLabel + ' ' + formatCountdown(remaining, t)))
            : null)),
        panel),
      )
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ds-fenggu: dictionaries')
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'ds-fenggu.status',
          order: 120,
          locale: NS,
        }, FengguStatus))
      },
    }
  },
})
