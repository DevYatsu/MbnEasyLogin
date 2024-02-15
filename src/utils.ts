export function updateTabURL(tabId: number, newUrl: string) {
  chrome.tabs.update(tabId, { url: newUrl }, function (updatedTab) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError)
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
  const { password, username, credentialsError } = (await chrome.storage.local.get()) as {
    password: string | undefined
    username: string | undefined
    credentialsError: true | undefined
  }

  if (credentialsError) {
    return Promise.reject(new Error("Nom d'utilisateur ou mot de passe invalide!"))
  }

  if (!username || !password) {
    return Promise.reject(new Error('Aucun identifiant entré pour se connecter!'))
  }
}

export async function setIsScriptRunner() {
  await chrome.storage.session.set({ isScriptRunner: true })
}
export async function IsScriptRunner(): Promise<boolean> {
  const { isScriptRunner } = await chrome.storage.session.get()

  return !!isScriptRunner
}
export async function clearScriptRunner() {
  await chrome.storage.session.remove('isScriptRunner')
}

export async function setCrendentialsError() {
  await chrome.storage.local.set({ credentialsError: true })

  // after setting a credentials error the error can
  // only be removed when credentials are changed in options page
}
