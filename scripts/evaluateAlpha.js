/**
 * It will be used to evaluate the alphabet
 * @param {string} answer the answer
 * @param {string[]} responseList the list of responses
 * @param {char} alphabet a single character
 * @returns answers
 */
export default function evaluateAlpha(answer, responseList, alphabet) {
  const fullList = responseList.join("").toUpperCase();
  const isSelected = fullList.includes(alphabet);
  if (answer.includes(alphabet) && fullList.includes(alphabet)) {
    for (let i of responseList) {
      if (i.toUpperCase().indexOf(alphabet) === answer.indexOf(alphabet))
        return {
          isSelected,
          isSameLocation: true,
          includesChar: true,
        };
    }
    return {
      isSelected,
      isSameLocation: false,
      includesChar: true,
    };
  }
  return {
    isSelected,
    isSameLocation: false,
    includesChar: false,
  };
}
