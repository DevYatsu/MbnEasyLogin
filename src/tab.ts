export function executeScriptOnTab(tabId: number, func: (...arg: any) => void, args?: any[]) {
  chrome.scripting.executeScript({ target: { tabId }, func, args }, function () {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    }
  })
}

export function updateTabURL(tabId: number, newUrl: string) {
  chrome.tabs.update(tabId, { url: newUrl }, function (updatedTab) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    } else {
      console.log('Tab URL updated successfully.')
    }
  })
}

type PupilsPagesQueries = {
  grades: string
  absences: string
  textbook: string
  moodle: string
  messages: string
}

export async function changeTabUrlParams(tabId: number, newPlace: keyof PupilsPagesQueries) {
  const query = {
    pupil: {
      grades: 'sg.do?PROC=CONSULTER_RELEVE&ACTION=AFFICHER_RELEVE_NOTES_ELEVE',
      absences: 'sg.do?PROC=GESTION_ABSENCES_TUTEUR_ELEVE&ACTION=AFFICHER_RECAPITULATIF_ABSENCES',
      textbook: 'sg.do?PROC=CLASSEUR_PEDA&ACTION=AFFICHER_ELEVES_ACCUEIL',
      moodle: 'sg.do?PROC=MOODLE',
      messages: 'sg.do?PROC=MESSAGERIE',
    },
    teacher: {}, // maybe add features to support teachers connexion as well
  }

  if (!query.pupil[newPlace]) {
    return
  }
  const url = (await chrome.tabs.get(tabId)).url
  if (url) {
    const baseURL = new URL(url)
    if (baseURL.hostname.indexOf('.monbureaunumerique.fr') != -1) {
      updateTabURL(tabId, `${baseURL.protocol}//${baseURL.host}/${query.pupil[newPlace]}`)
    }
  }
}

export async function connectToMBN(finalTabCategory?: keyof PupilsPagesQueries): Promise<{
  connected: boolean
  error?: string
}> {
  try {
    const { password } = await chrome.storage.local.get('password')
    const { username } = await chrome.storage.local.get('username')

    if (!username || !password) {
      throw new Error('No username or password set to connect')
    }

    const { tabId } = await chrome.runtime.sendMessage({ action: 'createTab' })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!tabId) {
      throw new Error('Failed to create a new tab')
    }

    const tabInfo = await chrome.tabs.get(tabId)

    if (!tabInfo.url) {
      return { connected: false, error: 'Tab no longer exists' }
    }

    const isLoggedIn =
      tabInfo.url === 'https://www.monbureaunumerique.fr/sg.do?PROC=PAGE_ACCUEIL&ACTION=VALIDER'

    if (!isLoggedIn) {
      await chrome.tabs.sendMessage(tabId, {
        action: 'profileSelection',
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await chrome.tabs.sendMessage(tabId, {
        action: 'authoritySelection',
        password,
        username,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newTabInfo = await chrome.tabs.get(tabId)
      if (!newTabInfo.url) {
        return { connected: false, error: 'Tab no longer exists' }
      }

      const wrongCredentials = newTabInfo.url?.startsWith(
        'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=',
      )
      if (wrongCredentials) {
        await chrome.tabs.remove(tabId)
        throw new Error('Invalid credentials: change them in the options page!')
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await chrome.tabs.sendMessage(tabId, {
        action: 'success',
      })
    }

    await new Promise((resolve) => setTimeout(resolve, 700))

    const { goToFirstSchoolAutomatically } = await chrome.storage.local.get(
      'goToFirstSchoolAutomatically',
    )

    if (goToFirstSchoolAutomatically) {
      await chrome.tabs.sendMessage(tabId, {
        action: 'redirectOnFirstSchool',
      })

      //todo!! error happening here, need to figure it out
    }
    if (finalTabCategory) {
      await changeTabUrlParams(tabId, finalTabCategory)
    }
    await chrome.tabs.update(tabId, { selected: true })

    return { connected: true }
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      return { connected: false, error: error.message }
    } else if (typeof error === 'string') {
      return { connected: false, error: error }
    } else {
      return { connected: false, error: error as string }
    }
  }
}
