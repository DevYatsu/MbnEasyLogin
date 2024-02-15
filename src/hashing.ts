import CryptoJS from 'crypto-js'

export async function encrypt(str: string) {
  const secret_key: string = (await chrome.storage.local.get('key'))['key']
  // key must necessarily be defined

  if (!secret_key) {
    throw new Error('No secret key defined! Something is wrong!')
  }

  const encrypted = CryptoJS.AES.encrypt(str, secret_key)
  console.log({ encrypted })

  return encrypted
}

export async function decrypt(encryptedString: CryptoJS.lib.CipherParams) {
  const secret_key = (await chrome.storage.local.get('key'))['key']
  // key must necessarily be defined

  if (!secret_key) {
    throw new Error('No secret key defined! Something is wrong!')
  }

  console.log({ encryptedString })

  const decryptedBytes = CryptoJS.AES.decrypt(encryptedString, secret_key)
  const plainText = decryptedBytes.toString(CryptoJS.enc.Utf8)

  return plainText
}

export function generate_key(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const length = 30
  let key = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    key += charset[randomIndex]
  }
  return key
}
