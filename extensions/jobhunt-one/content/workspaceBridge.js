(() => {
  const STORAGE_KEY = 'jobhuntCapturedJobs'

  const postJobsToWorkspace = () => {
    chrome.storage.local.get({ [STORAGE_KEY]: [] }, (result) => {
      const jobs = Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : []

      window.postMessage(
        {
          source: 'jobhunt-one-extension',
          type: 'JOBHUNT_EXTENSION_JOBS',
          jobs,
        },
        window.location.origin,
      )
    })
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window) {
      return
    }

    const message = event.data

    if (message?.source === 'jobhunt-one-workspace' && message.type === 'JOBHUNT_REQUEST_EXTENSION_JOBS') {
      postJobsToWorkspace()
    }
  })

  window.setTimeout(postJobsToWorkspace, 500)
})()
