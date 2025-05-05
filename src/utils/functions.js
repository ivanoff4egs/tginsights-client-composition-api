export function formatDate(dateString) {
  const date = new Date(dateString)
  const options = {'hour12': false}

  return `${date.toLocaleDateString()} ${date.toLocaleTimeString('uk-UA', options)}`
}
