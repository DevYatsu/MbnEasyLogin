chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'createTab') {
    ;(async () => {
      const tab = await chrome.tabs.create({
        active: false,
        url: 'https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT',
      })

      if (tab.id) {
        sendResponse({ tabId: tab.id })
      }
    })()
    return true
  }
})

export {}
