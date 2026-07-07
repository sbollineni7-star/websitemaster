(() => {
  const tools = globalThis.JobHuntPortalTools

  if (!tools) {
    return
  }

  const getDocumentTitle = () => {
    const title = document.title.split('|')[0] || document.title.split('-')[0] || ''
    return tools.normalize(title.replace(/\s+Dice\.com$/i, ''))
  }

  const extractJob = () => {
    const url = tools.cleanUrl()
    const description = tools.readFirst([
      '[data-cy="jobDescription"]',
      '[data-testid="job-description"]',
      '.job-description',
      '.job-details',
      'main',
    ])
    const title =
      tools.readFirst([
        '[data-cy="jobTitle"]',
        '[data-testid="job-title"]',
        '.job-title',
        'h1',
      ]) ||
      getDocumentTitle() ||
      tools.readMeta(['og:title', 'twitter:title'])
    const company =
      tools.readFirst([
        '[data-cy="companyName"]',
        '[data-testid="company-name"]',
        '.company-name',
        'a[href*="/company/"]',
      ]) || tools.readMeta(['og:site_name'])
    const location =
      tools.readFirst([
        '[data-cy="location"]',
        '[data-testid="job-location"]',
        '.job-location',
        '[class*="location"]',
      ]) || ''

    return {
      id: `dice-${tools.hashJob(url)}`,
      source: 'Dice',
      title: tools.normalize(title),
      company: tools.normalize(company),
      location: tools.normalize(location),
      description: tools.normalize(description).slice(0, 6000),
      url,
    }
  }

  tools.injectCaptureButton(extractJob)
  tools.bindExtractor(extractJob)
  tools.watchForNavigation(extractJob)
})()
