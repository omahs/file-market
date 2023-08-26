export const getIpfsCidWithFilePath = (ipfs: string) => {
  const pattern = /ipfs:\/\/([A-Za-z0-9/.-_]+)/

  return pattern.exec(ipfs)?.[1] ?? ''
}

export const getHttpLinkFromIpfsString = (ipfs: string) => {
  console.log(ipfs)
  if (!ipfs) return ''
  const cidWithFilePath = getIpfsCidWithFilePath(ipfs)

  console.log(cidWithFilePath)

  return `https://gateway.lighthouse.storage/ipfs/${cidWithFilePath}`
}
