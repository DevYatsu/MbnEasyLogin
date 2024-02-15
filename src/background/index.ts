import { decrypt, generate_key } from '../hashing'
import { clearScriptRunner, IsScriptRunner, setCrendentialsError } from '../utils'

chrome.runtime.onMessage.addListener((msg, messageSender, sendReply) => {
  switch (msg.action) {
    case 'requestCredentials': {
      ;(async () => {
        const { hashedUsername, hashedPassword } = await chrome.storage.local.get()
        // username and password defined for sure

        const username = decrypt(hashedUsername)
        const password = decrypt(hashedPassword)

        sendReply({ username, password })
      })()

      return true
    }

    case 'setCredentialsError': {
      ;(async () => {
        await setCrendentialsError()
        await clearScriptRunner()
      })()
    }

    case 'requestGoingOnFirstSchool': {
      ;(async () => {
        const { goToFirstSchoolAutomatically } = await chrome.storage.local.get()

        await clearScriptRunner()

        sendReply({ goToFirstSchoolAutomatically: !!goToFirstSchoolAutomatically })
      })()

      return true
    }

    case 'requestIsScriptRunner': {
      ;(async () => {
        const isScriptRunner = await IsScriptRunner()
        // true if script is ran by the extension

        sendReply({ isScriptRunner })
      })()

      return true
    }

    case 'clearScriptRunner': {
      ;(async () => {
        await clearScriptRunner()
      })()
    }
  }
})

chrome.runtime.onInstalled.addListener(async function (details) {
  if (details.reason === 'install') {
    const key = generate_key()
    await chrome.storage.local.set({ key })
  }
})

export {}
