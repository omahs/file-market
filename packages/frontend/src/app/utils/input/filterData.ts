export interface IFilterData {
  value: string
  pattern?: RegExp
  isLowerCase?: boolean
  isDisableEnglishPriority?: boolean
}

export const filterData = ({ value, pattern, isLowerCase, isDisableEnglishPriority }: IFilterData) => {
  console.log(isLowerCase)
  let result = value
  if (isLowerCase) result = result.toLowerCase()
  if (!isDisableEnglishPriority) {
    const patternEnglish = /^[a-zA-Z0-9\W]+$/
    result = result.split('').filter(item => {
      return patternEnglish?.test(item)
    }).join('')
  }
  if (pattern) {
    result = result.split('').filter(item => {
      return pattern?.test(item)
    }).join('')
  }

  return result
}
