// @ts-check

export default function createArray(length, fill = "") {
  const arr = new Array(length);
  arr.fill(fill);
  return arr;
}
