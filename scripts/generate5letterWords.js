// @ts-check

import randomWords from "random-words";

/**
 * this function will return 5 letter words e.g. angel
 * @returns string - 5 characters long
 */
export default function generate5letterWord() {
  let str = "";
  while (str.length !== 5) {
    str = randomWords();
  }
  return str.toUpperCase();
}
