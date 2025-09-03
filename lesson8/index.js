function reverseArray(array) {
  const newArray = [];
  for (let i = array.length - 1; i >= 0; i--)
    newArray.push(array[i]);
  return newArray;
}

function removeElement(array, element) {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) continue;
    newArray.push(array[i]);
  }
  return newArray;
}