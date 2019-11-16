var input = [2, 4, 5, 9, 11, 23, 86, 87, 91, 94, 95, 102];

function binsearch(a, i) {
  var l = 0,
      r = a.length - 1;
  while(l <= r) {
    var m = l + Math.floor((r - l) / 2);
    if(a[m] === i) {
      return m;
    }
    if(a[m] > i) {
      r = m - 1;
    } else {
      l = m + 1;    }
  }
  return -1;

}

console.log(binsearch(input, 9));
