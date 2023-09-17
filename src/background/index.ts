import { executeScriptOnTab, updateTabURL } from '../tab'

export type Request = {
  tabId?: number
  action?: string
  username?: string
  password?: string
}

chrome.runtime.onMessage.addListener((request: Request, sender, sendResponse) => {
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

  if (request.tabId) {
    const tabId = request.tabId

    if (request.action === 'profileSelection') {
      // choose weither you're a teacher, a pupil or legal representative and from what kind of school
      // or manage the case if the user was already connected

      executeScriptOnTab(tabId, () => {
        if (
          document.location.href ===
          'https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT'
        ) {
          if (document.querySelector('.form__label[for="idp-EDU"]')) {
            ;(document.querySelector('.form__label[for="idp-EDU"]')! as HTMLButtonElement).click()
          }
          if (document.getElementById('button-submit')) {
            document.getElementById('button-submit')?.click()
          }
        }
      })
    }

    if (request.action === 'authoritySelection') {
      if (!request.password || !request.username) {
        return
      }
      // choose weither you're a pupil or a legal representative

      executeScriptOnTab(
        tabId,
        (password: string, username: string) => {
          document.getElementById('bouton_eleve')?.click()

          if (
            document.location.href.startsWith(
              'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=',
            )
          ) {
            if (document.getElementById('username')) {
              ;(document.getElementById('username')! as HTMLInputElement).value = username!
            }
            if (document.getElementById('password')) {
              ;(document.getElementById('password')! as HTMLInputElement).value = password!
            }

            document.getElementById('bouton_valider')?.click()
          }
        },
        [request.password, request.username],
      )
    }

    if (request.action === 'success') {
      // sometimes allow to directly go to the school page

      executeScriptOnTab(tabId, () => {
        if (
          document.location.href === 'https://cas.monbureaunumerique.fr/saml/SAMLAssertionConsumer'
        ) {
          if (document.querySelector('.msg__title')?.textContent === 'Connexion réussie') {
            ;(
              document.querySelector(
                'div.msg__content > p:nth-child(4) > strong > a',
              )! as HTMLAnchorElement
            ).click()
          }
        }
      })
    }

    if (request.action === 'redirectOnFirstSchool') {
      // when arrived on the main app redirect to the first school in school list, which is certainly the school you go to
      executeScriptOnTab(tabId, () => {
        if (
          document.location.href ===
          'https://www.monbureaunumerique.fr/sg.do?PROC=PAGE_ACCUEIL&ACTION=VALIDER'
        ) {
          // go to first school in list
          if (document.querySelector('nav > div > div > ul > li:nth-child(1) > a')) {
            ;(
              document.querySelector(
                'nav > div > div > ul > li:nth-child(1) > a',
              )! as HTMLAnchorElement
            ).click()
          }
        }
      })
    }
  }
})

export {}
