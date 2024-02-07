// the content script that is ran everytime you come on a page listed in the manifest (that is one related to https://monbureaunumerique.fr/)

;(async () => {
  const { isScriptRunner } = await chrome.runtime.sendMessage({
    action: 'requestIsScriptRunner',
    // should be true if the script is ran on call of the extension and not when the user goes on the website
  })

  console.log({ isScriptRunner })

  if (isScriptRunner) {
    const url = document.location.href
    console.log(url)

    const actions = {
      roleSelection: () => {
        if (document.querySelector('.form__label[for="idp-EDU"]')) {
          // Simulate a click on the element
          ;(document.querySelector('.form__label[for="idp-EDU"]')! as HTMLAnchorElement).click()
        }

        if (document.getElementById('button-submit')) {
          // Simulate a click on the element
          document.getElementById('button-submit')?.click()
        }
      },
      login: async () => {
        if (
          !document.referrer.startsWith(
            'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=',
          ) // check if the page is not reload because password did not work
        ) {
          document.getElementById('bouton_eleve')?.click()

          const { username, password } = await chrome.runtime.sendMessage({
            action: 'requestCredentials',
          })

          if (document.getElementById('username')) {
            ;(document.getElementById('username')! as HTMLInputElement).value = username
          }
          if (document.getElementById('password')) {
            ;(document.getElementById('password')! as HTMLInputElement).value = password
          }

          document.getElementById('bouton_valider')?.click()
        } else {
          if (
            document.getElementById('erreurIdentifiant')?.getAttribute('hidden') === 'false' ||
            document.getElementById('erreurMdp')?.getAttribute('hidden') === 'false'
          ) {
            // it means password or/and id is wrong
            await chrome.runtime.sendMessage({
              action: 'setCredentialsError',
            })
          }
        }
      },
      loginSuccess: () => {
        if (document.querySelector('.msg__title')?.textContent?.indexOf('Successful') != -1) {
          ;(
            document.querySelector(
              'body > main > div > div > div > div > div > div > div > div > div.msg__content > p:nth-child(4) > strong > a',
            )! as HTMLAnchorElement
          )?.click()
        }
      },
      homePage: async () => {
        const { goToFirstSchoolAutomatically } = await chrome.runtime.sendMessage({
          action: 'requestGoingOnFirstSchool',
        })
        if (goToFirstSchoolAutomatically) {
          if (document.querySelector('nav > div > div > ul > li:nth-child(1) > a')) {
            // go to first school in list
            ;(
              document.querySelector(
                'nav > div > div > ul > li:nth-child(1) > a',
              )! as HTMLAnchorElement
            ).click()
          }
        }

        await chrome.runtime.sendMessage({
          action: 'clearScriptRunner',
        })
      },
    }

    if (url.startsWith('https://cas.monbureaunumerique.fr/login')) {
      actions['roleSelection']()
    } else if (url.startsWith('https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/')) {
      await actions['login']()
    } else if (url.startsWith('https://cas.monbureaunumerique.fr/saml/SAMLAssertionConsumer')) {
      actions['loginSuccess']()
    } else if (url.startsWith('https://www.monbureaunumerique.fr/sg.do')) {
      // when arrived on the main app redirect to the first school in school list, which is certainly the school you go to
      await actions['homePage']()
    }
  }
})()

export {}
