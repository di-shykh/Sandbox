/*Description:
Given an array of integers as strings and numbers, return the sum of the array values as if all were numbers.

Return your answer as a number.*/
function sumMix(x) {
  const initialValue = 0;
  const sum = x.reduce((accumulator, currentValue) => +accumulator + (+currentValue), initialValue);
  return sum;
  // return x.map(a => +a).reduce((a, b) => a + b);

}