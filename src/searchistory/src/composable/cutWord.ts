const cutWord = (originalWord: string, maxLength: number) => {
  if (originalWord.length >= maxLength) {
    return `「${originalWord.substring(0, 20)}...」`;
  } else {
    return `「${originalWord}」`;
  }
}
export default cutWord;
