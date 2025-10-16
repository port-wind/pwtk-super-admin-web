let globalVariables = {
  manageSiteId: ''
}

type GlobalVariablesKeys = keyof typeof globalVariables

export const setGlobalVariables = (key: GlobalVariablesKeys, value: string) => {
  globalVariables[key] = value
}

export const getGlobalVariables = (key: GlobalVariablesKeys) => {
  return globalVariables[key]
}
