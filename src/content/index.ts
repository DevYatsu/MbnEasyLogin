let url = document.location.href

if (
  url ===
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

if (url.startsWith('https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=')) {
  if (
    !document.referrer.startsWith(
      'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=',
    )
  ) {
    document.getElementById('bouton_eleve')?.click()

    const { username, password } = await chrome.runtime.sendMessage({
      action: 'requestCredentials',
    })
    // todo! manage error here if username or password not defined

    if (document.getElementById('username')) {
      ;(document.getElementById('username')! as HTMLInputElement).value = username
    }
    if (document.getElementById('password')) {
      ;(document.getElementById('password')! as HTMLInputElement).value = password
    }

    document.getElementById('bouton_valider')?.click()
  }
}

if (url === 'https://cas.monbureaunumerique.fr/saml/SAMLAssertionConsumer') {
  ;(
    document.querySelector('div.msg__content > p:nth-child(4) > strong > a')! as HTMLAnchorElement
  ).click()
}

// when arrived on the main app redirect to the first school in school list, which is certainly the school you go to
if (
  document.location.href ===
  'https://www.monbureaunumerique.fr/sg.do?PROC=PAGE_ACCUEIL&ACTION=VALIDER'
) {
  const { goToFirstSchoolAutomatically } = await chrome.runtime.sendMessage({
    action: 'requestGoingOnFirstSchool',
  })
  if (goToFirstSchoolAutomatically) {
    if (document.querySelector('nav > div > div > ul > li:nth-child(1) > a')) {
      // go to first school in list
      ;(
        document.querySelector('nav > div > div > ul > li:nth-child(1) > a')! as HTMLAnchorElement
      ).click()
    }
  }
}

export {}
