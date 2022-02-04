const sanitize = (originWord: string) => {
  const splitReg = /(?=```)/
  const array = originWord.split(splitReg)

  let sanitizedAllWord = ""

  for (let i = 0; i < array.length; i++) {
    const splitReg = /^```\w+\s/
    if (!splitReg.test(array[i])) {
      const sanitizedBlockWord = escapeHTML(array[i])
      sanitizedAllWord = sanitizedAllWord + sanitizedBlockWord;
    } else {
      sanitizedAllWord = sanitizedAllWord + array[i];
    }
  }
  return sanitizedAllWord;
}

const escapeHTML = (word: string) => {
  return word.replace(/(?<!(media))&(?!(token))?/g, '&lt;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "&#x27;");
}

const reSanitize = (sanitizedWord: string) => {
  return sanitizedWord.replace(/&lt;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
};

export { sanitize, reSanitize }
