// return an array in the form [0, 1, 2, ..., len -1]
export const generateLinearNumericArray = (limit, min = 0) => {
  const linearNumericArray = [];
  let i = min;
  while (i < limit) {
    linearNumericArray.push(i);
    i += 1;
  }
  return linearNumericArray;
};

// generate a uint as randomly as possible
export const getRandomInt = () => {
  const intArray = new Uint32Array(1);
  window.crypto.getRandomValues(intArray);
  return intArray[0];
};

// return random number below non-inclusive limit
export const getRandomIntWithLimit = (limit) => getRandomInt() % limit;

// generate array of unique, sorted uints under $limit
export const getUniqueRandomIntsWithLimit = (limit, count, min = 0) => {
  const randomNumArray = [];
  const availableInts = generateLinearNumericArray(limit, min);
  // randomly pop $count values out of the array and insert into return array
  for (let i = 0; i < count; i += 1) {
    const nextIndex = getRandomIntWithLimit(availableInts.length);
    randomNumArray.push(availableInts[nextIndex]);
    availableInts.splice(nextIndex, 1);
  }
  return randomNumArray;
};
