chrome.runtime.onMessage.addListener((msg, messageSender, sendReply) => {
  console.log(messageSender)
  if (msg.action === 'requestCredentials') {
    ;(async () => {
      const { username, password } = await chrome.storage.local.get()

      if (!username || !password) {
        // todo! create an error here
        return
      }

      sendReply({ username, password })
    })()

    return true
  }

  if (msg.action === 'requestGoingOnFirstSchool') {
    ;(async () => {
      const { goToFirstSchoolAutomatically } = await chrome.storage.local.get()

      sendReply({ goToFirstSchoolAutomatically: !!goToFirstSchoolAutomatically })
    })()

    return true
  }
})

export {}
