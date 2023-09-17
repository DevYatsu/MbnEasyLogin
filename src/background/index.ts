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

// chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
//   if (changeInfo.url && changeInfo.status != 'loading') {
//     if (
//       changeInfo.url === 'https://www.monbureaunumerique.fr/sg.do?PROC=PAGE_ACCUEIL&ACTION=VALIDER'
//     ) {
//       const { goToFirstSchoolAutomatically } = await chrome.storage.local.get(
//         'goToFirstSchoolAutomatically',
//       )

//       if (goToFirstSchoolAutomatically) {
//         await chrome.tabs.sendMessage(tabId, {
//           action: 'redirectOnFirstSchool',
//         })
//       }
//     }
//   }
// })

export {}
