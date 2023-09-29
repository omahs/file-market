import { type checkCryptoField, type checkCryptoObject } from '../types/types'

export function setNextFieldToFalseAfterTrue<T extends checkCryptoObject>(obj: T): T {
  const newObject = { ...obj }
  const keys = Object.keys(newObject) as Array<keyof T>
  for (let i = 1; i < keys.length; i++) {
    if (newObject[keys[i]] === 'waiting' && newObject[keys[i - 1]] === 'success') {
      (newObject[keys[i]] as checkCryptoField) = 'failed'
      break
    }
  }

  return newObject
}

export function hasFalse(obj: checkCryptoObject): boolean {
  for (const key in obj) {
    if (obj[key] === 'failed') {
      return true
    }
  }

  return false
}

export function restoreStateDisplayValue<T extends checkCryptoObject>(obj: T): T {
  const newObject = { ...obj }
  for (const key in newObject) {
    (newObject[key] as checkCryptoField | undefined) = 'waiting'
  }

  return newObject
}
