function toRawTags(raw: string): string[] {
  let begin = 0
  const res = []
  for(let i = 0; i < raw.length; i++) {
    const c = raw.charAt(i)
    if (c === '<') {
      begin = i
    } else if (c === '>') {
      res.push(raw.substring(begin, i+1)) 
    }
  }
  return res
}

function parse(raw: string) {
}
