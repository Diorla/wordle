// @ts-check

export default function createArray(length, fill = "") {
  const arr = new Array(length >= 0 ? length : 0);
  arr.fill(fill);
  return arr;
}
