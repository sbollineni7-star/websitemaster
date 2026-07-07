(() => {
  const STORAGE_KEY = 'jobhuntCapturedJobs'
  const BUTTON_ID = 'jobhunt-one-capture-button'
  const TOAST_ID = 'jobhunt-one-toast'

  const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim()

  const readFirst = (selectors, root = document) => {
    for (const selector of selectors) {
      const element = root.querySelector(selector)
      const value = normalize(element?.innerText || element?.textContent)

      if (value) {
        return value
      }
    }

    return ''
  }

  const readMeta = (names) => {
    for (const name of names) {
      const element =
        document.querySelector(`meta[property="${name}"]`) ||
        document.querySelector(`meta[name="${name}"]`)
      const value = normalize(element?.getAttribute('content'))

      if (value) {
        return value
      }
    }

    return ''
  }

  const hashJob = (value) => {
    let hash = 0
    const text = String(value || '')

    for (let index = 0; index < text.length; index += 1) {
      hash = (hash << 5) - hash + text.charCodeAt(index)
      hash |= 0
    }

    return Math.abs(hash).toString(36)
  }

  const cleanUrl = () => {
    const url = new URL(window.location.href)
    const keepParams = new URLSearchParams()
    const preservedKeys = ['currentJobId', 'jobId', 'jid']

    preservedKeys.forEach((key) => {
      const value = url.searchParams.get(key)

      if (value) {
        keepParams.set(key, value)
      }
    })

    url.search = keepParams.toString()
    url.hash = ''
    return url.toString()
  }

  const notifyBackground = () => {
    try {
      chrome.runtime.sendMessage({ type: 'JOBHUNT_JOB_CAPTURED' })
    } catch {
      return
    }
  }

  const saveJob = (job, callback) => {
    chrome.storage.local.get({ [STORAGE_KEY]: [] }, (result) => {
      const existingJobs = Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : []
      const existingIndex = existingJobs.findIndex((item) => item.url === job.url || item.id === job.id)
      const nextJob = {
        ...job,
        capturedAt: new Date().toISOString(),
      }

      const nextJobs =
        existingIndex >= 0
          ? existingJobs.map((item, index) => (index === existingIndex ? { ...item, ...nextJob } : item))
          : [nextJob, ...existingJobs]

      chrome.storage.local.set({ [STORAGE_KEY]: nextJobs.slice(0, 100) }, () => {
        notifyBackground()
        callback?.({
          ok: !chrome.runtime.lastError,
          status: existingIndex >= 0 ? 'updated' : 'saved',
          job: nextJob,
        })
      })
    })
  }

  const showToast = (message) => {
    document.getElementById(TOAST_ID)?.remove()

    const toast = document.createElement('div')
    toast.id = TOAST_ID
    toast.textContent = message
    Object.assign(toast.style, {
      position: 'fixed',
      right: '18px',
      bottom: '84px',
      zIndex: '2147483647',
      maxWidth: '260px',
      background: '#111827',
      color: '#ffffff',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: '8px',
      boxShadow: '0 16px 36px rgba(0,0,0,0.24)',
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      fontWeight: '700',
      lineHeight: '1.4',
      padding: '11px 13px',
    })

    document.body.appendChild(toast)
    window.setTimeout(() => toast.remove(), 2400)
  }

  const injectCaptureButton = (extractJob) => {
    if (document.getElementById(BUTTON_ID) || !document.body) {
      return
    }

    const button = document.createElement('button')
    button.id = BUTTON_ID
    button.type = 'button'
    button.textContent = 'Save to JobHunt One'
    Object.assign(button.style, {
      position: 'fixed',
      right: '18px',
      bottom: '22px',
      zIndex: '2147483647',
      minHeight: '44px',
      border: '0',
      borderRadius: '8px',
      background: '#0f766e',
      color: '#ffffff',
      boxShadow: '0 16px 34px rgba(15,118,110,0.3)',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      fontWeight: '800',
      padding: '0 16px',
    })

    button.addEventListener('mouseenter', () => {
      button.style.background = '#111827'
    })

    button.addEventListener('mouseleave', () => {
      button.style.background = '#0f766e'
    })

    button.addEventListener('click', () => {
      const job = extractJob()

      if (!job.title && !job.company && !job.description) {
        showToast('Open a job detail page first.')
        return
      }

      saveJob(job, (result) => {
        showToast(result.status === 'updated' ? 'Job updated in JobHunt One.' : 'Job saved to JobHunt One.')
      })
    })

    document.body.appendChild(button)
  }

  const bindExtractor = (extractJob) => {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (!message || !['JOBHUNT_EXTRACT_CURRENT', 'JOBHUNT_SAVE_CURRENT'].includes(message.type)) {
        return false
      }

      const job = extractJob()

      if (message.type === 'JOBHUNT_EXTRACT_CURRENT') {
        sendResponse({ ok: true, job })
        return false
      }

      saveJob(job, (result) => sendResponse(result))
      return true
    })
  }

  const watchForNavigation = (extractJob) => {
    let lastUrl = window.location.href
    window.setInterval(() => {
      if (lastUrl === window.location.href) {
        return
      }

      lastUrl = window.location.href
      window.setTimeout(() => injectCaptureButton(extractJob), 800)
    }, 1000)
  }

  globalThis.JobHuntPortalTools = {
    cleanUrl,
    hashJob,
    injectCaptureButton,
    bindExtractor,
    normalize,
    readFirst,
    readMeta,
    watchForNavigation,
  }
})()
