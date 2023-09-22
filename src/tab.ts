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

export async function connectToMBN(
  extensionGeneratedTabId: number,
  finalTabCategory?: keyof PupilsPagesQueries,
): Promise<{
  connected: boolean
  error?: string
}> {
  try {
    const { password } = await chrome.storage.local.get('password')
    const { username } = await chrome.storage.local.get('username')

    if (!username || !password) {
      throw new Error('No username or password set to connect')
    }

    chrome.webNavigation.onCompleted.addListener(async (details) => {
      console.log(details)
      if (details.frameId === 0 && details.tabId) {
        if (details.tabId !== extensionGeneratedTabId) {
          return
        }

        if (
          details.url ===
          'https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT'
        ) {
          await chrome.tabs.sendMessage(extensionGeneratedTabId, {
            action: 'profileSelection',
          })
        }

        if (
          details.url.startsWith(
            'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution',
          )
        ) {
          await chrome.tabs.sendMessage(extensionGeneratedTabId, {
            action: 'authoritySelection',
            password,
            username,
          })
        }

        if (
          details.url === 'https://www.monbureaunumerique.fr/sg.do?PROC=PAGE_ACCUEIL&ACTION=VALIDER'
        ) {
          // logged in
          const { goToFirstSchoolAutomatically } = await chrome.storage.local.get(
            'goToFirstSchoolAutomatically',
          )

          if (goToFirstSchoolAutomatically) {
            await chrome.tabs.sendMessage(extensionGeneratedTabId, {
              action: 'redirectOnFirstSchool',
            })

            //todo!! error happening here, need to figure it out
          }
          if (finalTabCategory) {
            await changeTabUrlParams(extensionGeneratedTabId, finalTabCategory)
          }
          await chrome.tabs.update(extensionGeneratedTabId, { selected: true })
        }

        if (details.url === 'https://cas.monbureaunumerique.fr/saml/SAMLAssertionConsumer') {
          await chrome.tabs.sendMessage(extensionGeneratedTabId, {
            action: 'success',
          })
        }
      }
    })

    return { connected: true }
  } catch (error) {
    console.error(error)

    await chrome.tabs.remove(extensionGeneratedTabId)

    if (error instanceof Error) {
      return { connected: false, error: error.message }
    } else if (typeof error === 'string') {
      return { connected: false, error: error }
    } else {
      return { connected: false, error: error as string }
    }
  }
}

export async function createNewTab(): Promise<void> {
  chrome.tabs.create(
    {
      active: false,
      url: 'https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT',
    },
    (tab) => {
      console.log(tab)
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { extensionTab: true })
        chrome.tabs.update(tab.id, { selected: true })
      }
    },
  )
}
