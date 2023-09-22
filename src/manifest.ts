import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  name: 'MbnEasyLogin',
  description: 'An extension to easily login to Mbn',
  version: '1.0.0',
  manifest_version: 3,
  icons: {
    '128': 'img/logo-128.png',
    '48': 'img/logo-48.png',
    '512': 'img/logo-512.png',
  },
  action: {
    default_popup: 'popup.html',
    default_icon: 'img/logo-48.png',
  },
  options_page: 'options.html',
  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        'https://cas.monbureaunumerique.fr/login*',
        'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=*',
        'https://www.monbureaunumerique.fr/sg.do?*',
      ],
      js: ['src/content/index.ts'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['img/logo-48.png', 'img/logo-128.png', 'img/logo-512.png'],
      matches: [],
    },
  ],
  permissions: ['tabs', 'activeTab', 'scripting', 'storage', 'webNavigation'],
  host_permissions: [
    'https://cas.monbureaunumerique.fr/login?service=https%3A%2F%2Fwww.monbureaunumerique.fr%2Fsg.do%3FPROC%3DIDENTIFICATION_FRONT',
    'https://educonnect.education.gouv.fr/idp/profile/SAML2/POST/SSO?execution=*',
    'https://www.monbureaunumerique.fr/sg.do?*',
  ],
})
