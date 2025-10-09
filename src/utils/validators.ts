// src/utils/validationUtils.ts
export function createDomainValidator(errorMessage: string) {
  return (rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }
    const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/
    if (!domainPattern.test(value)) {
      callback(new Error(errorMessage))
    } else {
      callback()
    }
  }
}
// CREATE
export function createUrlValidator(errorMessage: string) {
  return (rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }

    try {
      const url = new URL(value)

      // Check for valid protocols
      if (!['http:', 'https:', 'ftp:', 'ftps:'].includes(url.protocol)) {
        callback(new Error(errorMessage))
        return
      }

      // Check for valid hostname (requires at least one dot)
      if (!url.hostname.includes('.') || url.hostname.endsWith('.')) {
        callback(new Error(errorMessage))
        return
      }

      // // Optional: Check for specific TLDs
      // const validTLDs = ['.com', '.org', '.net', /* add more as needed */]
      // if (!validTLDs.some(tld => url.hostname.endsWith(tld))) {
      //   throw new Error('Invalid TLD')
      // }

      callback()
    } catch (error) {
      callback(new Error(errorMessage))
    }
  }
}

export function createNumberValidator(errorMessage: string = '请输入数字') {
  return (rule: any, value: any, callback: (error?: Error) => void) => {
    console.log('createNumberValidator', value)
    if (!value && value !== 0) {
      callback()
      return
    }

    const numberValue = Number(value)
    if (isNaN(numberValue)) {
      callback(new Error(errorMessage))
    } else {
      callback()
    }
  }
}

export function createAlphanumericValidator(errorMessage: string = '请输入英文及数字') {
  return (rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }

    const alphanumericPattern = /^[a-zA-Z0-9]+$/
    if (!alphanumericPattern.test(value)) {
      callback(new Error(errorMessage))
    } else {
      callback()
    }
  }
}

export function createChineseAlphanumericValidator(errorMessage: string = '请输入中文、英文或数字') {
  return (rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback()
      return
    }

    const pattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
    if (!pattern.test(value)) {
      callback(new Error(errorMessage))
    } else {
      callback()
    }
  }
}

export function createDuplicateValidator<T>(
  existingData: T[],
  fieldName: keyof T,
  errorMessage: string = '该值已存在'
) {
  return (rule: any, value: any, callback: (error?: Error) => void) => {
    console.log('createDuplicateValidator', value)
    if (!value) {
      callback()
      return
    }
    const isDuplicate = existingData.some((item) => item[fieldName] === value.toString())
    if (isDuplicate) {
      callback(new Error(errorMessage))
    } else {
      callback()
    }
  }
}
