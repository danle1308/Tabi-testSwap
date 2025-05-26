export function bigNumberFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  // const thousandRx = /^(?!0+\.00)(?=.{1,9}(\.|$))\d{1,3}(,\d{3})*(\.\d+)?$/
  const items = lookup
    .slice()
    .reverse()
    .find((item) => {
      return num >= item.value
    })

  if (items?.value === undefined) return '0'

  if (items?.value < 100000000) {
    return num.toLocaleString('en-US', {
      style: 'decimal', // Other options: 'currency', 'percent', etc.
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  }

  return items ? (num / items.value).toFixed(digits).replace(rx, '$1') + items.symbol : '0'
}
