chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'profileSelection') {
    // Check if the current URL matches the login page URL
    if (
      document.location.href ===
      'https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT'
    ) {
      if (document.querySelector('.form__label[for="idp-EDU"]')) {
        // Simulate a click on the element
        ;(document.querySelector('.form__label[for="idp-EDU"]')! as HTMLAnchorElement).click()
      }

      if (document.getElementById('button-submit')) {
        // Simulate a click on the element
        document.getElementById('button-submit')?.click()
      }
    }
  }

  if (request.action === 'authoritySelection') {
    if (!request.username) {
      return
    }

    if (!request.password) {
      return
    }

    document.getElementById('bouton_eleve')?.click()

    if (
      document.location.href.startsWith(
        'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=',
      )
    ) {
      if (document.getElementById('username')) {
        ;(document.getElementById('username')! as HTMLInputElement).value = request.username
      }
      if (document.getElementById('password')) {
        ;(document.getElementById('password')! as HTMLInputElement).value = request.password
      }

      document.getElementById('bouton_valider')?.click()
      return
    } else {
      return
    }
  }

  if (request.action === 'success') {
    // sometimes allow to directly go to the school page

    if (document.location.href === 'https://cas.monbureaunumerique.fr/saml/SAMLAssertionConsumer') {
      if (document.querySelector('.msg__title')?.textContent === 'Connexion réussie') {
        ;(
          document.querySelector(
            'div.msg__content > p:nth-child(4) > strong > a',
          )! as HTMLAnchorElement
        ).click()
      }
    }
    return
  }

  if (request.action === 'redirectOnFirstSchool') {
    // when arrived on the main app redirect to the first school in school list, which is certainly the school you go to
    if (
      document.location.href ===
      'https://www.monbureaunumerique.fr/sg.do?PROC=PAGE_ACCUEIL&ACTION=VALIDER'
    ) {
      // go to first school in list
      if (document.querySelector('nav > div > div > ul > li:nth-child(1) > a')) {
        ;(
          document.querySelector('nav > div > div > ul > li:nth-child(1) > a')! as HTMLAnchorElement
        ).click()
      }
    }
    return
  }
})

export {}
