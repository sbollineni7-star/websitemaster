const STORAGE_KEY = 'jobhuntCapturedJobs'
const WORKSPACE_URL = 'http://127.0.0.1:3000/jobhunt'

const portalStatus = document.getElementById('portalStatus')
const captureBtn = document.getElementById('captureBtn')
const openWorkspaceBtn = document.getElementById('openWorkspaceBtn')
const copyBtn = document.getElementById('copyBtn')
const clearBtn = document.getElementById('clearBtn')
const jobCount = document.getElementById('jobCount')
const jobList = document.getElementById('jobList')
const feedback = document.getElementById('feedback')

const getActiveTab = () =>
  new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0]))
  })

const getJobs = () =>
  new Promise((resolve) => {
    chrome.storage.local.get({ [STORAGE_KEY]: [] }, (result) => {
      resolve(Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : [])
    })
  })

const setJobs = (jobs) =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: jobs }, resolve)
  })

const isSupportedPortal = (url = '') => /linkedin\.com\/jobs/i.test(url) || /dice\.com/i.test(url)

const getPortalLabel = (url = '') => {
  if (/linkedin\.com/i.test(url)) return 'LinkedIn'
  if (/dice\.com/i.test(url)) return 'Dice'
  return 'Unsupported page'
}

const setFeedback = (message) => {
  feedback.textContent = message
}

const renderJobs = async () => {
  const jobs = await getJobs()
  jobCount.textContent = String(jobs.length)

  if (!jobs.length) {
    jobList.innerHTML = '<div class="job-item"><span>No jobs captured yet.</span></div>'
    return
  }

  jobList.innerHTML = jobs
    .slice(0, 8)
    .map(
      (job) => `
        <article class="job-item">
          <strong>${escapeHtml(job.title || 'Untitled job')}</strong>
          <span>${escapeHtml([job.company, job.location].filter(Boolean).join(' - ') || job.source || 'Job portal')}</span>
          <a href="${escapeAttribute(job.url || '#')}" target="_blank" rel="noreferrer">${escapeHtml(job.source || 'Open')}</a>
        </article>
      `,
    )
    .join('')
}

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const escapeAttribute = escapeHtml

const updatePortalStatus = async () => {
  const tab = await getActiveTab()
  const supported = isSupportedPortal(tab?.url)
  const portal = getPortalLabel(tab?.url)

  portalStatus.className = `status ${supported ? 'supported' : 'blocked'}`
  portalStatus.textContent = supported
    ? `${portal} detected. Open a job detail page, then capture it.`
    : 'Open a LinkedIn Jobs or Dice job page to capture.'
  captureBtn.disabled = !supported
}

captureBtn.addEventListener('click', async () => {
  const tab = await getActiveTab()

  if (!tab?.id || !isSupportedPortal(tab.url)) {
    setFeedback('Open a supported job page first.')
    return
  }

  chrome.tabs.sendMessage(tab.id, { type: 'JOBHUNT_SAVE_CURRENT' }, async (response) => {
    if (chrome.runtime.lastError || !response?.ok) {
      setFeedback('Refresh the job page, then try capture again.')
      return
    }

    setFeedback(response.status === 'updated' ? 'Job updated.' : 'Job captured.')
    await renderJobs()
  })
})

openWorkspaceBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: WORKSPACE_URL })
})

copyBtn.addEventListener('click', async () => {
  const jobs = await getJobs()
  const json = JSON.stringify(jobs, null, 2)

  try {
    await navigator.clipboard.writeText(json)
    setFeedback('Captured jobs copied as JSON.')
  } catch {
    setFeedback(json)
  }
})

clearBtn.addEventListener('click', async () => {
  await setJobs([])
  chrome.runtime.sendMessage({ type: 'JOBHUNT_JOB_CAPTURED' })
  setFeedback('Captured jobs cleared.')
  await renderJobs()
})

updatePortalStatus()
renderJobs()
