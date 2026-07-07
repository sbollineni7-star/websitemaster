const STORAGE_KEY = 'jobhuntCapturedJobs'

const updateBadge = () => {
  chrome.storage.local.get({ [STORAGE_KEY]: [] }, (result) => {
    const jobs = Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : []
    const count = jobs.length

    chrome.action.setBadgeText({ text: count ? String(count) : '' })
    chrome.action.setBadgeBackgroundColor({ color: '#0f766e' })
  })
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get({ [STORAGE_KEY]: [] }, (result) => {
    chrome.storage.local.set({ [STORAGE_KEY]: result[STORAGE_KEY] || [] }, updateBadge)
  })
})

chrome.runtime.onStartup.addListener(updateBadge)

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== 'JOBHUNT_JOB_CAPTURED') {
    return false
  }

  updateBadge()
  sendResponse({ ok: true })
  return false
})
