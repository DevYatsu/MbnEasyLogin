import { clearScriptRunner, IsScriptRunner, setCrendentialsError } from '../utils'

chrome.runtime.onMessage.addListener((msg, messageSender, sendReply) => {
  if (msg.action === 'requestCredentials') {
    ;(async () => {
      const { username, password } = await chrome.storage.local.get()
      // username and password defined for sure

      sendReply({ username, password })
    })()

    return true
  }

  if (msg.action === 'setCredentialsError') {
    ;(async () => {
      await setCrendentialsError()
      await clearScriptRunner()
    })()
  }

  if (msg.action === 'requestGoingOnFirstSchool') {
    ;(async () => {
      const { goToFirstSchoolAutomatically } = await chrome.storage.local.get()

      await clearScriptRunner()

      sendReply({ goToFirstSchoolAutomatically: !!goToFirstSchoolAutomatically })
    })()

    return true
  }

  if (msg.action === 'requestIsScriptRunner') {
    ;(async () => {
      const isScriptRunner = await IsScriptRunner()

      // true if script is ran by the extension

      sendReply({ isScriptRunner })
    })()

    return true
  }

  if (msg.action === 'clearScriptRunner') {
    ;(async () => {
      await clearScriptRunner()
    })()
  }
})

export {}
