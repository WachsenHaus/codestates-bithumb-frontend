export function quickSort(arr) {
  if (arr.length < 2) {
    return arr;
  }

  let pivot = arr[0];
  let left = [];
  let right = [];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > pivot) {
      left.push(arr[i]);
    } else if (arr[i] < pivot) {
      right.push(arr[i]);
    } else {
      pivot.push(arr[i]);
    }
  }
  console.log(`left: ${left}, pivot: ${pivot}, right: ${right}`);

  return quickSort(left).concat(pivot, quickSort(right));
}
