function extractLinks(inputString) {
  const urlRegex = /(https?:\/\/[^\s]+)/g

  const linksArray = []

  const modifiedString = inputString.replace(urlRegex, (url) => {
    const urlObject = new URL(url)
    const domain = urlObject.hostname
    linksArray.push(url)
    return `<span class="text-[#3DE0E0] underline"><a href='${url}' target='_blank'>${domain}</a></span>`
  })

  return {
    originalString: modifiedString,
    links: linksArray
  }
}

export default extractLinks