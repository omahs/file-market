export const formatNumber = (number?: string | number, toFixed?: number): string => {
  if (!number) return ''

  let value = number
  if (toFixed) {
    value = Number(value).toFixed(toFixed)
  }
  const parts = value.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  return parts.join('.')
}

export const cutNumber = (number?: string | number): string => {
  if (!number) return ''

  if (+number < 1000) return number.toString()
  if (+number < 1000000) return parseFloat((+number / 1000).toFixed(2)).toString() + 'K'

  return parseFloat((+number / 10000000).toFixed(2)).toString() + 'M'
}
