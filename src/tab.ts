export function executeScriptOnTab(tabId: number, func: (...arg: any) => void, args?: any[]) {
  chrome.scripting.executeScript({ target: { tabId }, func, args }, function () {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
    } else {
      console.log('Script executed successfully on the tab.')
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
  tabId?: number
  connected: boolean
  error?: string
}> {
  try {
    const { tabId } = await chrome.runtime.sendMessage({ action: 'createTab' })
    await new Promise((r) => setTimeout(r, 500))

    const isLoggedIn =
      (await chrome.tabs.get(tabId)).url ===
      'https://www.monbureaunumerique.fr/sg.do?PROC=PAGE_ACCUEIL&ACTION=VALIDER'

    if (!isLoggedIn) {
      await chrome.runtime.sendMessage({
        action: 'profileSelection',
        tabId,
      })

      await new Promise((r) => setTimeout(r, 1000))

      const { password } = await chrome.storage.local.get('password')
      const { username } = await chrome.storage.local.get('username')

      console.log(password, username)
      if (Object.keys(username).length === 0) {
        throw new Error('No username set to connect')
      }
      if (Object.keys(password).length === 0) {
        throw new Error('No password set to connect')
      }

      await chrome.runtime.sendMessage({
        action: 'authoritySelection',
        tabId,
        password,
        username,
      })

      await new Promise((r) => setTimeout(r, 700))

      const wrongCredentials = (await chrome.tabs.get(tabId)).url?.startsWith(
        'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=',
      )

      if (wrongCredentials) {
        throw new Error('Invalid credentials: change them in the options page!')
      }

      await chrome.runtime.sendMessage({
        action: 'success',
        tabId,
      })
    }

    await new Promise((r) => setTimeout(r, 700))

    const { goToFirstSchoolAutomatically } = await chrome.storage.local.get(
      'goToFirstSchoolAutomatically',
    )

    if (goToFirstSchoolAutomatically) {
      await chrome.runtime.sendMessage({
        action: 'redirectOnFirstSchool',
        tabId,
      })

      await new Promise((r) => setTimeout(r, 500))
    }

    if (finalTabCategory) {
      await changeTabUrlParams(tabId, finalTabCategory)
    }

    return { tabId, connected: true }
  } catch (error) {
    console.error('Error creating tab:', error)
    if (error instanceof Error) {
      return { connected: false, error: error.message }
    } else if (typeof error === 'string') {
      return { connected: false, error: error }
    } else {
      return { connected: false, error: error as string }
    }
  }
}
