(() => {
  const tools = globalThis.JobHuntPortalTools

  if (!tools) {
    return
  }

  const getDocumentTitle = () => {
    const title = document.title.split('|')[0] || ''
    return tools.normalize(title.replace(/\s+LinkedIn$/i, ''))
  }

  const extractJob = () => {
    const url = tools.cleanUrl()
    const description = tools.readFirst([
      '.jobs-description-content__text',
      '.jobs-description__content',
      '.show-more-less-html__markup',
      '#job-details',
      '[data-test-job-description]',
    ])
    const metaTitle = tools.readMeta(['og:title', 'twitter:title'])
    const title =
      tools.readFirst([
        '.job-details-jobs-unified-top-card__job-title',
        '.top-card-layout__title',
        '[data-test-job-title]',
        'h1',
      ]) ||
      getDocumentTitle() ||
      metaTitle
    const company =
      tools.readFirst([
        '.job-details-jobs-unified-top-card__company-name a',
        '.job-details-jobs-unified-top-card__company-name',
        '.topcard__org-name-link',
        '[data-test-job-company-name]',
      ]) || tools.readMeta(['og:site_name'])
    const location =
      tools.readFirst([
        '.job-details-jobs-unified-top-card__tertiary-description-container',
        '.job-details-jobs-unified-top-card__primary-description-container',
        '.topcard__flavor--bullet',
        '[data-test-job-location]',
      ]) || ''

    return {
      id: `linkedin-${tools.hashJob(url)}`,
      source: 'LinkedIn',
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
