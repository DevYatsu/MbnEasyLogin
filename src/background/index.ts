import { decrypt, generate_key } from '../hashing'
import { clearScriptRunner, IsScriptRunner, setCrendentialsError } from '../utils'

chrome.runtime.onMessage.addListener((msg, messageSender, sendReply) => {
  switch (msg.action) {
    case 'requestCredentials': {
      ;(async () => {
        const { username: hashedUsername, password: hashedPassword } =
          await chrome.storage.local.get(['password', 'username'])
        // username and password must necessarily be defined

        if (!hashedUsername || !hashedPassword) {
          throw new Error('Credentials are not defined!')
        }

        const username = await decrypt(hashedUsername)
        const password = await decrypt(hashedPassword)

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

    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  }
})

export {}
