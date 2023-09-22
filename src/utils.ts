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

export async function createNewTab(): Promise<void> {
  const urlToOpen =
    'https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT'

  await chrome.tabs.create({ url: urlToOpen })
}

export async function checkCredentials(): Promise<void> {
  const { password } = await chrome.storage.local.get('password')
  const { username } = await chrome.storage.local.get('username')

  if (!username || !password) {
    return Promise.reject(new Error('No username or password set to connect'))
  }
}

export async function setIsScriptRunner() {
  await chrome.storage.session.set({ isScriptRunner: true })
}

export async function IsScriptRunner(): Promise<boolean> {
  const { isScriptRunner } = await chrome.storage.session.get('isScriptRunner')

  return !!isScriptRunner
}
